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
export function cleanReply(text) {
    let t = text
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