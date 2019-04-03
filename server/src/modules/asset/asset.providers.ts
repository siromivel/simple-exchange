import { Connection } from "typeorm"
import { Asset } from "./asset.entity"

export const assetProviders = [
  {
    provide: "AssetRepository",
    useFactory: (conn: Connection) => conn.getRepository(Asset),
    inject: [Connection],
  },
]
