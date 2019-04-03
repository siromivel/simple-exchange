import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../user/user.entity"
import { Asset } from "../asset/asset.entity"
import { ColumnNumericTransformer } from "../common/transformers/ColumnNumericTransformer"

@Entity()
export class Holding {
  @PrimaryGeneratedColumn()
  id: number

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  balance: number

  @ManyToOne(type => Asset)
  @JoinColumn({ name: "asset_id" })
  asset: Asset

  @ManyToOne(type => User)
  @JoinColumn({ name: "exchange_user_id" })
  user: User
}
