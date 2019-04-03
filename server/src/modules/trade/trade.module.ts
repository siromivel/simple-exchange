import { Module } from "@nestjs/common";
import { TradeService } from "./trade.service";
import { tradeProviders } from "./trade.providers";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holding } from "../holding/holding.entity";
import { TradingPair } from "../trading_pair/trading_pair.entity";
import { UserController } from "../user/user.controller";
import { User } from "../user/user.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([Holding]),
        TypeOrmModule.forFeature([TradingPair]),
        TypeOrmModule.forFeature([User])

    ],
    providers: [TradeService, ...tradeProviders],
    exports: [TradeService]
})
export class TradeModule {}
