import { Controller, Get, Param } from "@nestjs/common"
import { TradingPair } from "./trading_pair.entity"
import { TradingPairService } from "./trading_pair.service"
import { Orderbook } from "../order/orderbook.dto"
import { OrderService } from "../order/order.service"

@Controller("pairs")
export class TradingPairController {
    constructor(
        private readonly orderService: OrderService,
        private readonly tradingPairService: TradingPairService
    ) {}

    @Get()
    async findAll(): Promise<TradingPair[]> {
        return await this.tradingPairService.findAll()
    }

    @Get(":id/orderbook")
    async findOrderBookByid(@Param("id") id: number): Promise<Orderbook> {
        return await this.orderService.findOrderBookByTradingPairId(id)
    }
}
