export type Standing = {
    home: number | null,
    away: number | null;
}

export interface StandingWithFinished extends Standing {
    finished: boolean,
}
