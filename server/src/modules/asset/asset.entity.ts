import { Entity, Column, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { Holding } from "../holding/holding.entity";

  @Entity()
  export class Asset {
    @PrimaryGeneratedColumn() id: number

    @Column() name: string

    @Column() symbol: string

    @OneToMany(type => Holding, holding => holding.asset)
    holdings: Holding[]
}
