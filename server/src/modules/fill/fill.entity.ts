import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Order } from "../order/order.entity"
import { User } from "../user/user.entity"
import { ColumnNumericTransformer } from "../common/transformers/ColumnNumericTransformer"

@Entity()
export class Fill {
  @PrimaryGeneratedColumn()
  id: string

  @Column("numeric", {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  quantity: number

  @ManyToOne(type => Order)
  @JoinColumn({ name: "exchange_order_id" })
  order: Order

  @ManyToOne(type => User)
  @JoinColumn({ name: "exchange_user_id" })
  user: User
}
