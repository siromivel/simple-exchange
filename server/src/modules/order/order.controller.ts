import { Controller, Get, Param } from "@nestjs/common"
import { Order } from "./order.entity"
import { OrderService } from "./order.service"
import { Orderbook } from "./orderbook.dto";

@Controller("orders")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get(":tradingPairId/asks")
    async findAllAsksByTradingPairId(@Param("tradingPairId") tradingPairId): Promise<Order[]> {
        return await this.orderService.findAllAsksByTradingPairId(tradingPairId)
    }

    @Get(":tradingPairId/bids")
    async findAllBidsByTradingPairId(@Param("tradingPairId") tradingPairId): Promise<Order[]> {
        return await this.orderService.findAllBidsByTradingPairId(tradingPairId)
    }

    @Get(":tradingPairId/orderbook")
    async findOrderBookByTradingPairId(@Param("tradingPairId") tradingPairId): Promise<Orderbook> {
        return await this.orderService.findOrderBookByTradingPairId(tradingPairId)
    }

    @Get(":userId")
    async findByUserId(@Param("userId") userId): Promise<Order[]> {
        return await this.orderService.findByUserId(userId)
    }
}
