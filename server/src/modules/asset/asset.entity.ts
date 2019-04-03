import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm"
import { Holding } from "../holding/holding.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  symbol: string

  @OneToMany(type => Holding, holding => holding.asset)
  @JoinTable({ name: "holding" })
  holdings: Holding[]

  @OneToMany(type => TradingPair, tradingPair => tradingPair.baseAsset)
  @JoinTable({ name: "trading_pair" })
  tradingPairs: TradingPair[]
}
