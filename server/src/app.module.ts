import { Module } from "@nestjs/common"
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from "./app.controller"

import { AssetController } from "./modules/asset/asset.controller"
import { AssetModule } from "./modules/asset/asset.module"
import { assetProviders } from "./modules/asset/asset.providers"
import { TradingPairController } from "./modules/trading_pair/trading_pair.controller"
import { TradingPairModule } from "./modules/trading_pair/trading_pair.module"
import { tradingPairProviders } from "./modules/trading_pair/trading_pair.providers"

@Module({
  imports: [AssetModule, TradingPairModule, TypeOrmModule.forRoot()],
  controllers: [AppController, AssetController, TradingPairController],
  providers: [...assetProviders, ...tradingPairProviders],
})

export class AppModule {}
