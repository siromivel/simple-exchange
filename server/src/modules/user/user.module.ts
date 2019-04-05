import { Module } from "@nestjs/common"
import { userProviders } from "./user.providers"
import { UserService } from "./user.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Asset } from "../asset/asset.entity"
import { Holding } from "../holding/holding.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    TypeOrmModule.forFeature([Holding]),
  ],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
