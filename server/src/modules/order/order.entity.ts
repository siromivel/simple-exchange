import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "../user/user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity";

  @Entity()
  export class Order {
    @PrimaryGeneratedColumn() id: string

    @Column() side: string

    @Column() userId: number

    @Column() open: boolean

    @Column() price: number

    @Column() quantity: number

    @Column() filled: number

    @ManyToOne(type => TradingPair)
    @JoinColumn({ name: "trading_pair_id" })
    tradingPair: TradingPair

    @ManyToOne(type => User)
    @JoinColumn({ name: "exchange_user_id" })
    user: User
}
