import { Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm"
import { Asset } from "../asset/asset.entity"

@Entity()
export class TradingPair {
    @PrimaryGeneratedColumn() id: number

    @OneToOne(type => Asset)
    @JoinColumn({ name: "base_asset_id" }) baseAsset: Asset

    @OneToOne(type => Asset)
    @JoinColumn({ name: "to_asset_id" }) toAsset: Asset
}
