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
    return text
        .replace(/\*\*(.+?)\*\*/g, '*$1*')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/[‐‑‒–]/g, '-')
        .replace(/[​-‍⁠﻿]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
//# sourceMappingURL=reply-quality.js.map