import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm"
import { Holding } from "../holding/holding.entity"
import { Trade } from "../trade/trade.entity";

@Entity("exchange_user")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(type => Holding, holding => holding.user)
  @JoinTable({ name: "holding" })
  holdings: Holding[]

  @OneToMany(type => Trade, trade => trade.user)
  @JoinTable({ name: "trade" })
  trades: Trade[]
}
