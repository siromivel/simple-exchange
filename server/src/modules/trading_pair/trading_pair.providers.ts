import { Connection } from "typeorm"
import { TradingPair } from "./trading_pair.entity"

export const tradingPairProviders = [
  {
    provide: "TradingPairRepository",
    useFactory: (conn: Connection) => conn.getRepository(TradingPair),
    inject: [Connection],
  },
]
