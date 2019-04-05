import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RedisModule } from "../redis/redis.module"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { PriceGateway } from "./price.gateway"

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([TradingPair])],
  providers: [PriceGateway],
})
export class PriceModule {}
