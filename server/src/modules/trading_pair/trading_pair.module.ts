import { Module } from "@nestjs/common";
import { TradingPairService } from "./trading_pair.service";
import { tradingPairProviders } from "./trading_pair.providers";

@Module({
    imports: [],
    providers: [TradingPairService, ...tradingPairProviders],
    exports: [TradingPairService]
})

export class TradingPairModule{}
