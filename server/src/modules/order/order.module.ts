import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../user/user.entity"
import { OrderService } from "./order.service"
import { orderProviders } from "./order.providers"
import { TradingPair } from "../trading_pair/trading_pair.entity"

@Module({
    imports: [
        TypeOrmModule.forFeature([TradingPair]),
        TypeOrmModule.forFeature([User])
    ],
    providers: [OrderService, ...orderProviders],
    exports: [OrderService]
})

export class OrderModule{}
