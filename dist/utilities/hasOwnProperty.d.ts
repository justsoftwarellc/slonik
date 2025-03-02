/**
 * A stricter type guard.
 * @see https://tsplay.dev/WK8zGw
 */
export declare const hasOwnProperty: <X extends {}, Y extends PropertyKey>(object: X, property: Y) => object is Record<Y, unknown> & X;
//# sourceMappingURL=hasOwnProperty.d.ts.map