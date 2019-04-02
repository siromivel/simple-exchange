import { Module } from "@nestjs/common"
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from "./app.controller"
import { AssetController } from "./modules/asset/asset.controller"
import { AssetModule } from "./modules/asset/asset.module"
import { assetProviders } from "./modules/asset/asset.providers"

@Module({
  imports: [AssetModule, TypeOrmModule.forRoot()],
  controllers: [AppController, AssetController],
  providers: [...assetProviders],
})

export class AppModule {}
