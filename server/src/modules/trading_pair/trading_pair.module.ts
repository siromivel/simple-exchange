import { Module } from "@nestjs/common"
import { tradingPairProviders } from "./trading_pair.providers"
import { TradingPairService } from "./trading_pair.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Order } from "../order/order.entity"

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [TradingPairService, ...tradingPairProviders],
    exports: [TradingPairService]
})

export class TradingPairModule{}
