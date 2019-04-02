import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

  @Entity()
  export class Order {
    @PrimaryGeneratedColumn() id: number

    @Column() side: string

    @Column() userId: number

    @Column() open: boolean

    @Column() price: number

    @Column() quantity: number

    @Column() filled: number
}
