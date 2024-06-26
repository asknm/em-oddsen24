import { UserWithId } from "./user";

export interface Odds {
    H: number,
    U: number,
    B: number,
};

export interface OddsWithBookmaker<T> extends Odds {
    bookmaker: T;
}

export type OddsArray = [
    H: number,
    U: number,
    B: number,
];

export enum OddsOptions {
    H,
    U,
    B,
};

export type OddsWithBookmakerName = OddsWithBookmaker<UserWithId>;

export function OddsFromArray(array: OddsArray): Odds {
    return {
        H: array[OddsOptions.H],
        U: array[OddsOptions.U],
        B: array[OddsOptions.B],
    };
};

export function ToOddsArray(odds: Odds): OddsArray {
    return [odds.H, odds.U, odds.B];
}
