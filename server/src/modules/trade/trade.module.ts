import { Module } from "@nestjs/common"
import { TradeService } from "./trade.service"
import { tradeProviders } from "./trade.providers"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { User } from "../user/user.entity"
import { Holding } from "../holding/holding.entity"
import { RedisModule } from "../redis/redis.module"

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([Holding]),
    TypeOrmModule.forFeature([TradingPair]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [TradeService, ...tradeProviders],
  exports: [TradeService],
})
export class TradeModule {}
