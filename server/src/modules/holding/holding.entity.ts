import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { User } from "../user/user.entity";
import { Asset } from "../asset/asset.entity";

  @Entity()
  export class Holding {
    @PrimaryGeneratedColumn() id: number

    @Column() side: string

    @Column() userId: number

    @Column() open: boolean

    @Column() price: number

    @Column() quantity: number

    @Column() filled: number

    @ManyToOne(type => Asset, asset => asset.holdings)
    asset: Asset

    @ManyToOne(type => User, user => user.holdings)
    user: User
}
