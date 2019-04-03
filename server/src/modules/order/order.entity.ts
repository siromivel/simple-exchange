import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "../user/user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { ColumnNumericTransformer } from "../common/transformers/ColumnNumericTransformer"

@Entity("exchange_order")
export class Order {
  @PrimaryGeneratedColumn() id: string

  @Column()
  side: string

  @Column()
  open: boolean

  @Column()
  @Column("numeric", {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number

  @Column()
  quantity: number

  @Column()
  @Column("numeric", {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  filled: number

  @ManyToOne(type => TradingPair)
  @JoinColumn({ name: "trading_pair_id" })
  tradingPair: TradingPair

  @ManyToOne(type => User)
  @JoinColumn({ name: "exchange_user_id" })
  user: User
}
