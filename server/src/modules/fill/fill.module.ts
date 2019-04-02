import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Order } from "../order/order.entity"
import { User } from "../user/user.entity"
import { FillService } from "./fill.service"
import { fillProviders } from "./fill.providers"

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        TypeOrmModule.forFeature([User])
    ],
    providers: [FillService, ...fillProviders],
    exports: [FillService]
})

export class FillModule{}
