const BROKEN_PATTERNS = [
    /\*{4,}/,
    /\*\*\.\.\.\*\*/,
    /\bglitch\b/i,
    /<\|[a-z_]+\|>/i,
    /"(ref|variant_id|offer_naira|price_naira)"\s*:/,
    /\bto=functions\./i,
];
export function looksBroken(text) {
    const t = (text ?? '').trim();
    if (!t)
        return true;
    return BROKEN_PATTERNS.some((re) => re.test(t));
}
const LINK_PLACEHOLDER = '[LINK]';
export function finalizeReply(reply, paymentLink) {
    const withLink = paymentLink
        ? reply.includes(LINK_PLACEHOLDER)
            ? reply.split(LINK_PLACEHOLDER).join(paymentLink)
            : `${reply}\n\n${paymentLink}`
        : reply.split(LINK_PLACEHOLDER).join('');
    return cleanReply(withLink);
}
export function cleanReply(text) {
    let t = text
        .replace(/\s*[(\[]?\s*\bref\b[:=\s]*[0-9a-f]{8}\b[)\]]?/gi, '')
        .replace(/\*\*(.+?)\*\*/g, '*$1*')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/[‐‑‒–]/g, '-')
        .replace(/[​-‍⁠﻿]/g, '')
        .replace(/\*+(?=https?:\/\/)/g, '')
        .replace(/(https?:\/\/[^\s*]+)\*+/g, '$1')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    const stars = (t.match(/\*/g) ?? []).length;
    if (stars % 2 === 1)
        t = t.replace(/\*/g, '');
    else if (/^\*[^*]+\*$/s.test(t))
        t = t.slice(1, -1).trim();
    return t;
}
//# sourceMappingURL=reply-quality.js.map