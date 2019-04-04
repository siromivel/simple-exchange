import { Module } from "@nestjs/common";
import { PriceGateway } from "./price.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TradingPair } from "../trading_pair/trading_pair.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([TradingPair])
    ],
    providers: [PriceGateway]
})
export class PriceModule {}
