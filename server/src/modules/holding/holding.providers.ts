import { Connection } from "typeorm"
import { Holding } from "./holding.entity"

export const holdingProviders = [
    {
        provide: "HoldingRepository",
        useFactory: (conn: Connection) => conn.getRepository(Holding),
        inject: [Connection]
    }
]
