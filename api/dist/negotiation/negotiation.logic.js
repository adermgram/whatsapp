const NAIRA = 100;
const ROUND_TO = 100 * NAIRA;
export function effectiveFloor(listKobo, floorKobo, maxDiscountPercent) {
    const pct = Math.min(Math.max(maxDiscountPercent, 0), 100);
    const discountFloor = Math.ceil((listKobo * (100 - pct)) / 100);
    return Math.min(listKobo, Math.max(floorKobo, discountFloor));
}
const roundUp = (kobo) => Math.ceil(kobo / ROUND_TO) * ROUND_TO;
export function evaluateOffer(input) {
    const { listKobo, floorKobo, maxDiscountPercent, offerKobo, priorRounds } = input;
    const floor = effectiveFloor(listKobo, floorKobo, maxDiscountPercent);
    if (offerKobo >= listKobo)
        return { decision: 'accept', priceKobo: listKobo };
    if (floor >= listKobo) {
        return { decision: 'decline', priceKobo: listKobo, final: true, suggestHandoff: false };
    }
    const room = listKobo - floor;
    const round = priorRounds + 1;
    const targetFor = (r) => {
        const concession = r === 1 ? 0.4 : r === 2 ? 0.75 : 1;
        return Math.min(listKobo, Math.max(floor, roundUp(listKobo - room * concession)));
    };
    const target = targetFor(round);
    const standing = priorRounds > 0 ? targetFor(round - 1) : listKobo;
    if (offerKobo >= standing)
        return { decision: 'accept', priceKobo: standing };
    if (offerKobo >= target)
        return { decision: 'accept', priceKobo: offerKobo };
    if (round >= 5) {
        return { decision: 'decline', priceKobo: floor, final: true, suggestHandoff: true };
    }
    return { decision: 'counter', priceKobo: target, final: target === floor };
}
//# sourceMappingURL=negotiation.logic.js.map