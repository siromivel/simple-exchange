import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Order } from "../order/order.entity"
import { User } from "../user/user.entity"
import { FillService } from "./fill.service"
import { fillProviders } from "./fill.providers"
import { Holding } from "../holding/holding.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"

@Module({
    imports: [
        TypeOrmModule.forFeature([Holding]),
        TypeOrmModule.forFeature([Order]),
        TypeOrmModule.forFeature([TradingPair]),
        TypeOrmModule.forFeature([User])
    ],
    providers: [FillService, ...fillProviders],
    exports: [FillService]
})

export class FillModule{}
