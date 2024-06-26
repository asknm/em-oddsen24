import { Standing } from "./standing"

export type Score = {
    duration: String,
    fullTime: Standing,
    regularTime: Standing | undefined,
}