import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "../user/user.entity"
import { Asset } from "../asset/asset.entity"

  @Entity()
  export class Holding {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    balance: number

    @ManyToOne(type => Asset)
    @JoinColumn({ name: "asset_id" })
    asset: Asset

    @ManyToOne(type => User)
    @JoinColumn({ name: "exchange_user_id" })
    user: User
}
