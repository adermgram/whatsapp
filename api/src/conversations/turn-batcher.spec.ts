import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TurnBatcher } from './turn-batcher.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const settle = (ms: number) => vi.advanceTimersByTimeAsync(ms);

describe('TurnBatcher', () => {
  it('answers a burst of messages once, after the quiet period', async () => {
    const batcher = new TurnBatcher(3000);
    const runs: number[] = [];
    const run = async () => void runs.push(Date.now());

    const a = batcher.submit('chat', run); // "hi"
    await settle(1000);
    const b = batcher.submit('chat', run); // "i want man united jersey"
    await settle(1000);
    const c = batcher.submit('chat', run); // "Away one"

    await settle(2999);
    expect(runs).toHaveLength(0); // still inside the quiet period after the LAST message
    await settle(2);
    expect(runs).toHaveLength(1); // one turn for all three messages
    await Promise.all([a, b, c]); // and every message's promise resolves
  });

  it('keeps different chats independent', async () => {
    const batcher = new TurnBatcher(1000);
    const seen: string[] = [];
    void batcher.submit('a', async () => void seen.push('a'));
    void batcher.submit('b', async () => void seen.push('b'));
    await settle(1001);
    expect(seen.sort()).toEqual(['a', 'b']);
  });

  it('drops the answer and redoes the turn when a message arrives while the AI is thinking', async () => {
    const batcher = new TurnBatcher(1000);
    const sent: string[] = [];
    let call = 0;
    const runner = async (control: { isStale: () => boolean }) => {
      const n = ++call;
      await new Promise((r) => setTimeout(r, 4000)); // the AI is "thinking"
      if (control.isStale()) return; // a newer message arrived: do not send this answer
      sent.push(`answer ${n}`);
    };

    const first = batcher.submit('chat', runner);
    await settle(1001); // turn 1 starts
    await settle(2000); // ...still thinking
    const second = batcher.submit('chat', runner); // customer writes again mid-thought
    await settle(2001); // turn 1 finishes, is stale, nothing sent
    expect(sent).toEqual([]);
    await settle(1000 + 4001); // quiet period, then turn 2 runs to completion
    expect(sent).toEqual(['answer 2']); // exactly one reply, covering everything
    await Promise.all([first, second]);
  });

  it('never starves a chatty customer: after the re-run limit it sends anyway', async () => {
    const batcher = new TurnBatcher(100, 2);
    const sent: number[] = [];
    let call = 0;
    const runner = async (control: { isStale: () => boolean }) => {
      const n = ++call;
      await new Promise((r) => setTimeout(r, 500));
      if (!control.isStale()) sent.push(n);
    };
    const pending = [batcher.submit('chat', runner)];
    // a message lands during every single turn
    for (let i = 0; i < 6; i++) {
      await settle(300);
      pending.push(batcher.submit('chat', runner));
    }
    await settle(5000);
    expect(sent.length).toBeGreaterThanOrEqual(1);
    await Promise.all(pending);
  });

  it('keeps going after a runner throws', async () => {
    const batcher = new TurnBatcher(10);
    const ok: string[] = [];
    const bad = batcher.submit('chat', async () => {
      throw new Error('boom');
    });
    await settle(11);
    await bad; // resolves, does not reject
    void batcher.submit('chat', async () => void ok.push('recovered'));
    await settle(11);
    expect(ok).toEqual(['recovered']);
  });

  it('with no quiet period it still runs asynchronously, once per message', async () => {
    const batcher = new TurnBatcher(0);
    let runs = 0;
    const a = batcher.submit('chat', async () => void runs++);
    await settle(1);
    await a;
    const b = batcher.submit('chat', async () => void runs++);
    await settle(1);
    await b;
    expect(runs).toBe(2);
  });

  describe('hold: a message that has arrived but is not stored yet', () => {
    it('keeps the AI from starting, however slow storing the messages is', async () => {
      const batcher = new TurnBatcher(1000);
      const runs: string[] = [];
      const run = async () => void runs.push('ran');

      // three messages arrive within a second, but storing each takes 3 seconds (slow, remote database)
      const r1 = batcher.hold('chat');
      const r2 = batcher.hold('chat');
      const r3 = batcher.hold('chat');
      await settle(3000);
      const a = batcher.submit('chat', run);
      r1();
      await settle(3000);
      const b = batcher.submit('chat', run);
      r2();
      await settle(3000);
      const c = batcher.submit('chat', run);
      r3();

      expect(runs).toHaveLength(0); // 9 seconds in, nothing has run: messages were still being stored
      await settle(999);
      expect(runs).toHaveLength(0);
      await settle(2);
      expect(runs).toHaveLength(1); // ONE turn, one quiet period after the LAST message was stored
      await Promise.all([a, b, c]);
    });

    it('makes a turn that is already thinking stale', async () => {
      const batcher = new TurnBatcher(500);
      const sent: string[] = [];
      let call = 0;
      const runner = async (control: { isStale: () => boolean }) => {
        const n = ++call;
        await new Promise((r) => setTimeout(r, 3000));
        if (!control.isStale()) sent.push(`answer ${n}`);
      };

      const first = batcher.submit('chat', runner);
      await settle(501); // the AI starts thinking
      const release = batcher.hold('chat'); // the customer's next message arrives, still being stored
      await settle(3000); // the AI finishes: its answer is out of date
      expect(sent).toEqual([]);
      const second = batcher.submit('chat', runner);
      release();
      await settle(500 + 3001); // quiet period, then the redo
      expect(sent).toEqual(['answer 2']);
      await Promise.all([first, second]);
    });

    it('releases cleanly when the message turns out to need no answer (a duplicate or an owner command)', async () => {
      const batcher = new TurnBatcher(100);
      const release = batcher.hold('chat');
      release();
      release(); // releasing twice is harmless
      let runs = 0;
      void batcher.submit('chat', async () => void runs++);
      await settle(101);
      expect(runs).toBe(1);
    });
  });
});
