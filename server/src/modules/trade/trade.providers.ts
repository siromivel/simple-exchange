import { Connection } from "typeorm";
import { Trade } from "./trade.entity";

export const tradeProviders = [
    {
        provide: "TradeRepository",
        useFactory: (conn: Connection) => conn.getRepository(Trade),
        inject: [Connection],
    },
]
