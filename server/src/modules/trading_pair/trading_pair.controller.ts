import { Controller, Get } from "@nestjs/common"
import { TradingPair } from "./trading_pair.entity"
import { TradingPairService } from "./trading_pair.service"

@Controller("pairs")
export class TradingPairController {
    constructor(private readonly tradingPairService: TradingPairService) {}

    @Get('')
    async findAll(): Promise<TradingPair[]> {
        return await this.tradingPairService.findAll()
    }
}
