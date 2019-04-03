import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Asset } from "../asset/asset.entity"

@Entity()
export class TradingPair {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Asset)
  @JoinColumn({ name: "base_asset_id" })
  baseAsset: Asset

  @ManyToOne(type => Asset)
  @JoinColumn({ name: "to_asset_id" })
  toAsset: Asset
}
