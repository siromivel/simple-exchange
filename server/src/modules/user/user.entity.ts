import { Entity, Column, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm"
import { Holding } from "../holding/holding.entity"
import { Order } from "../order/order.entity"

  @Entity("exchange_user")
  export class User {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column()
    name: string

    @OneToMany(type => Order, order => order.user)
    @JoinTable({ name: "exchange_order" })
    orders: Order[]  

    @OneToMany(type => Holding, holding => holding.user)
    @JoinTable({ name: "holding" })
    holdings: Holding[]
}
