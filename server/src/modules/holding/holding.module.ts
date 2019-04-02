import { Module } from "@nestjs/common"
import { holdingProviders } from "./holding.providers"
import { HoldingService } from "./holding.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../user/user.entity"

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [HoldingService, ...holdingProviders],
    exports: [HoldingService]
})

export class HoldingModule{}
