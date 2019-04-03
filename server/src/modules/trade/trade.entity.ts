import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { ColumnNumericTransformer } from "../common/transformers/ColumnNumericTransformer"
import { User } from "../user/user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity";
import { tradingPairProviders } from "../trading_pair/trading_pair.providers";

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  type: string

  @Column("numeric", {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number

  @Column("numeric", {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  quantity: number

  @ManyToOne(type => TradingPair)
  @JoinColumn({ name: "trading_pair_id" })
  tradingPair: TradingPair

  @ManyToOne(type => User)
  @JoinColumn({ name: "exchange_user_id" })
  user: User
}
