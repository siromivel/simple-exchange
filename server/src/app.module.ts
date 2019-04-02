import { Module } from "@nestjs/common"
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from "./app.controller"

import { AssetController } from "./modules/asset/asset.controller"
import { AssetModule } from "./modules/asset/asset.module"
import { assetProviders } from "./modules/asset/asset.providers"
import { TradingPairController } from "./modules/trading_pair/trading_pair.controller"
import { TradingPairModule } from "./modules/trading_pair/trading_pair.module"
import { tradingPairProviders } from "./modules/trading_pair/trading_pair.providers"
import { HoldingController } from "./modules/holding/holding.controller";
import { HoldingModule } from "./modules/holding/holding.module";
import { holdingProviders } from "./modules/holding/holding.providers";
import { UserController } from "./modules/user/user.controller";
import { UserModule } from "./modules/user/user.module";
import { userProviders } from "./modules/user/user.providers";
import { OrderController } from "./modules/order/order.controller";
import { OrderModule } from "./modules/order/order.module";
import { orderProviders } from "./modules/order/order.providers";

@Module({
  imports: [
    AssetModule,
    HoldingModule,
    OrderModule,
    TradingPairModule,
    TypeOrmModule.forRoot(),
    UserModule
  ],
  controllers: [
    AppController,
    AssetController,
    HoldingController,
    OrderController,
    TradingPairController,
    UserController
  ],
  providers: [
    ...assetProviders,
    ...holdingProviders,
    ...orderProviders,
    ...tradingPairProviders,
    ...userProviders
  ],
})

export class AppModule {}
