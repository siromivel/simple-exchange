import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Holding } from "../holding/holding.entity"
import { Order } from "../order/order.entity"

  @Entity()
  export class User {
    @PrimaryGeneratedColumn() id: number
  
    @Column() name: string

    @OneToMany(type => Order, order => order.userId)
    orders: Order[]  

    @OneToMany(type => Holding, holding => holding.userId)
    holdings: Holding[]
}