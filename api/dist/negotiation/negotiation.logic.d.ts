export interface OfferInput {
    listKobo: number;
    floorKobo: number;
    maxDiscountPercent: number;
    offerKobo: number;
    priorRounds: number;
}
export type OfferResult = {
    decision: 'accept';
    priceKobo: number;
} | {
    decision: 'counter';
    priceKobo: number;
    final: boolean;
} | {
    decision: 'decline';
    priceKobo: number;
    final: true;
    suggestHandoff: boolean;
};
export declare function effectiveFloor(listKobo: number, floorKobo: number, maxDiscountPercent: number): number;
export declare function evaluateOffer(input: OfferInput): OfferResult;
