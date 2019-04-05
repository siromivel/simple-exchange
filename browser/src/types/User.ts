import { Holding } from "./Holding";

export type User = {
    id: number
    name: string
    holdings: Holding[]
}
