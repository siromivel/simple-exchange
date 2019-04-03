import { Connection } from "typeorm"
import { Fill } from "./fill.entity"

export const fillProviders = [
  {
    provide: "FillRepository",
    useFactory: (conn: Connection) => conn.getRepository(Fill),
    inject: [Connection],
  },
]
