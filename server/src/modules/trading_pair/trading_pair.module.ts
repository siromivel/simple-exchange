import { Module } from "@nestjs/common"
import { tradingPairProviders } from "./trading_pair.providers"
import { TradingPairService } from "./trading_pair.service"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  providers: [TradingPairService, ...tradingPairProviders],
  exports: [TradingPairService],
})
export class TradingPairModule {}
