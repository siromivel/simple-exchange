import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"

import { AssetController } from "./modules/asset/asset.controller"
import { AssetModule } from "./modules/asset/asset.module"
import { assetProviders } from "./modules/asset/asset.providers"
import { HoldingController } from "./modules/holding/holding.controller"
import { HoldingModule } from "./modules/holding/holding.module"
import { holdingProviders } from "./modules/holding/holding.providers"
import { PriceGateway } from "./modules/price/price.gateway"
import { PriceModule } from "./modules/price/price.module"
import { RedisModule } from "./modules/redis/redis.module"
import { TradeController } from "./modules/trade/trade.controller"
import { TradeModule } from "./modules/trade/trade.module"
import { tradeProviders } from "./modules/trade/trade.providers"
import { TradingPairController } from "./modules/trading_pair/trading_pair.controller"
import { TradingPairModule } from "./modules/trading_pair/trading_pair.module"
import { tradingPairProviders } from "./modules/trading_pair/trading_pair.providers"
import { UserController } from "./modules/user/user.controller"
import { UserModule } from "./modules/user/user.module"
import { userProviders } from "./modules/user/user.providers"

@Module({
  imports: [
    AssetModule,
    HoldingModule,
    PriceModule,
    RedisModule,
    TradeModule,
    TradingPairModule,
    TypeOrmModule.forRoot(),
    UserModule,
  ],
  controllers: [
    AppController,
    AssetController,
    HoldingController,
    TradeController,
    TradingPairController,
    UserController,
  ],
  providers: [
    ...assetProviders,
    ...holdingProviders,
    PriceGateway,
    ...tradeProviders,
    ...tradingPairProviders,
    ...userProviders,
  ],
})
export class AppModule {}
