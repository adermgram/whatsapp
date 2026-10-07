const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export interface TurnControl {
  /** True when a newer message arrived while this turn was being worked out. The answer must then be dropped. */
  isStale(): boolean;
}

export type TurnRunner = (control: TurnControl) => Promise<void>;

interface ChatState {
  timer?: ReturnType<typeof setTimeout>;
  running: boolean;
  dirty: boolean;
  /** Messages that have arrived but are not stored yet. The AI must not start while any are pending. */
  holds: number;
  runner?: TurnRunner;
  waiters: (() => void)[];
}

const MAX_HOLD_WAIT_MS = 60_000;

/**
 * Turns a burst of short messages into ONE answer.
 *
 *   customer: "hi"  ...  "i want man united jersey"  ...  "Away one"
 *
 * Without this the AI answered each fragment separately (three replies, each ignoring the others).
 * Now: wait `debounceMs` after the LAST message, then run one turn that sees all of them.
 *
 *   hold(key)    call the moment a message ARRIVES. Storing it can take a while (the database is remote), and the
 *                quiet period must not start, nor the AI run, while a message the customer already sent is unsaved.
 *   submit(key)  call once a message is stored and the AI should answer it.
 *
 * If a message lands while the AI is still thinking, that answer is dropped (isStale) and the turn is redone
 * with everything the customer has said. After `maxReruns` redo's we send anyway, so a chatty customer can
 * never starve themselves of a reply.
 *
 * Pure scheduling: it knows nothing about WhatsApp, the database or the AI.
 */
export class TurnBatcher {
  private readonly chats = new Map<string, ChatState>();

  constructor(
    private readonly debounceMs: number,
    private readonly maxReruns = 2,
  ) {}

  /** Mark "a message for this chat has arrived and is being stored". Returns the function that releases the hold. */
  hold(key: string): () => void {
    const st = this.stateFor(key);
    st.holds++;
    if (st.timer) {
      clearTimeout(st.timer);
      st.timer = undefined; // pause the quiet-period clock
    }
    if (st.running) st.dirty = true; // whatever the AI is about to say is already out of date
    let released = false;
    return () => {
      if (released) return;
      released = true;
      st.holds = Math.max(0, st.holds - 1);
      if (st.holds > 0 || st.running) return;
      if (st.waiters.length > 0) this.arm(key, st);
      else this.cleanup(key, st);
    };
  }

  /** Resolves once a turn that covers this message has finished (answered, dropped for good, or failed). */
  submit(key: string, runner: TurnRunner): Promise<void> {
    const st = this.stateFor(key);
    return new Promise<void>((resolve) => {
      st.waiters.push(resolve);
      st.runner = runner; // the newest runner closes over the freshest context
      st.dirty = true;
      if (st.running || st.holds > 0) return; // the running loop, or the last release(), takes it from here
      this.arm(key, st);
    });
  }

  private stateFor(key: string): ChatState {
    let st = this.chats.get(key);
    if (!st) {
      st = { running: false, dirty: false, holds: 0, waiters: [] };
      this.chats.set(key, st);
    }
    return st;
  }

  private arm(key: string, st: ChatState) {
    if (st.timer) clearTimeout(st.timer);
    st.timer = setTimeout(() => void this.run(key), this.debounceMs);
  }

  private cleanup(key: string, st: ChatState) {
    if (!st.timer && !st.running && st.holds === 0 && st.waiters.length === 0) this.chats.delete(key);
  }

  private async run(key: string): Promise<void> {
    const st = this.chats.get(key);
    if (!st) return;
    st.timer = undefined;
    if (st.holds > 0) return; // a message is still being stored: its release() re-arms the clock
    st.running = true;
    let reruns = 0;
    try {
      for (;;) {
        st.dirty = false;
        const forceSend = reruns >= this.maxReruns;
        // The runner owns its error handling (it must never leave a customer unanswered); a throw must not wedge the chat.
        await st.runner!({ isStale: () => !forceSend && st.dirty }).catch(() => undefined);
        if (!st.dirty) break;
        reruns++;
        await sleep(this.debounceMs); // let them finish typing before answering again
        const give = Date.now() + MAX_HOLD_WAIT_MS;
        while (st.holds > 0 && Date.now() < give) await sleep(25); // ...and finish storing what they sent
      }
    } finally {
      const waiters = st.waiters.splice(0);
      st.running = false;
      if (st.waiters.length > 0 && st.holds === 0) this.arm(key, st);
      else this.cleanup(key, st);
      for (const w of waiters) w();
    }
  }
}
