import { describe, expect, it } from 'vitest';
import { chatIdFromKey, extractContent, jidFromChatId } from './wa-messages.js';

describe('chatIdFromKey', () => {
  it('uses the phone number for a normal chat', () => {
    expect(chatIdFromKey({ remoteJid: '2348012345678@s.whatsapp.net' })).toBe('2348012345678');
    expect(chatIdFromKey({ remoteJid: '2348012345678:12@s.whatsapp.net' })).toBe('2348012345678'); // device suffix
  });

  it('prefers the phone number when WhatsApp addresses the person by LID but tells us the number', () => {
    expect(chatIdFromKey({ remoteJid: '98765@lid', remoteJidAlt: '2348012345678@s.whatsapp.net' })).toBe('2348012345678');
  });

  it('falls back to the LID when no phone number is available', () => {
    expect(chatIdFromKey({ remoteJid: '98765@lid' })).toBe('lid:98765');
  });

  it('never answers groups, status updates, broadcasts or channels', () => {
    expect(chatIdFromKey({ remoteJid: '12345-678@g.us' })).toBeNull();
    expect(chatIdFromKey({ remoteJid: 'status@broadcast' })).toBeNull();
    expect(chatIdFromKey({ remoteJid: '1203@newsletter' })).toBeNull();
    expect(chatIdFromKey({})).toBeNull();
  });

  it('round-trips to a sendable jid', () => {
    expect(jidFromChatId('2348012345678')).toBe('2348012345678@s.whatsapp.net');
    expect(jidFromChatId('lid:98765')).toBe('98765@lid');
  });
});

describe('extractContent', () => {
  it('reads plain and extended text', () => {
    expect(extractContent({ conversation: 'hello' })).toEqual({ type: 'text', text: 'hello' });
    expect(extractContent({ extendedTextMessage: { text: 'reply to something' } })).toEqual({
      type: 'text',
      text: 'reply to something',
    });
  });

  it('sees through disappearing-message and view-once wrappers', () => {
    expect(extractContent({ ephemeralMessage: { message: { conversation: 'secret' } } })).toEqual({
      type: 'text',
      text: 'secret',
    });
    expect(extractContent({ viewOnceMessageV2: { message: { imageMessage: { caption: 'look' } } } })).toEqual({
      type: 'image',
      text: 'look',
    });
  });

  it('recognises voice notes and images', () => {
    expect(extractContent({ audioMessage: { ptt: true } })).toEqual({ type: 'audio' });
    expect(extractContent({ imageMessage: {} })).toEqual({ type: 'image', text: undefined });
  });

  it('reads a PDF/document with its caption, and what the sender CLAIMS about it', () => {
    const longLike = { toNumber: () => 48213 }; // WhatsApp sends sizes as Long objects
    expect(
      extractContent({ documentMessage: { fileName: 'receipt.pdf', mimetype: 'application/pdf', fileLength: longLike, caption: 'paid' } }),
    ).toEqual({ type: 'document', text: 'paid', fileName: 'receipt.pdf', mimeType: 'application/pdf', fileSize: 48213 });
    // a document sent with a caption arrives wrapped, and is still seen
    expect(
      extractContent({ documentWithCaptionMessage: { message: { documentMessage: { fileName: 'a.pdf', fileLength: 10 } } } }),
    ).toMatchObject({ type: 'document', fileName: 'a.pdf', fileSize: 10 });
  });

  it('reads image size and type, tolerating odd values', () => {
    expect(extractContent({ imageMessage: { mimetype: 'image/jpeg', fileLength: '2048', caption: 'see' } })).toEqual({
      type: 'image',
      text: 'see',
      mimeType: 'image/jpeg',
      fileSize: 2048,
    });
    expect(extractContent({ imageMessage: { fileLength: 'not a number' } })).toMatchObject({ type: 'image', fileSize: undefined });
  });

  it('ignores reactions, protocol messages and empty input', () => {
    expect(extractContent({ reactionMessage: { text: '👍' } })).toBeNull();
    expect(extractContent({ protocolMessage: { type: 0 } })).toBeNull();
    expect(extractContent(null)).toBeNull();
    expect(extractContent({ conversation: '' })).toBeNull();
  });
});
