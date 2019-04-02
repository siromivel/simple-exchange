import { Module } from "@nestjs/common";
import { tradingPairProviders } from "./trading_pair.providers";
import { TradingPairService } from "./trading_pair.service";

@Module({
    imports: [],
    providers: [TradingPairService, ...tradingPairProviders],
    exports: [TradingPairService]
})

export class TradingPairModule{}
