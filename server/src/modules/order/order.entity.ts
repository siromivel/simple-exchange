import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { User } from "../user/user.entity";

  @Entity()
  export class Order {
    @PrimaryGeneratedColumn() id: number

    @Column() side: string

    @Column() userId: number

    @Column() open: boolean

    @Column() price: number

    @Column() quantity: number

    @Column() filled: number

    @ManyToOne(type => User, user => user.orders)
    user: User
}
