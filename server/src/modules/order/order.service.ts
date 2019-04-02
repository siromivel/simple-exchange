import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Order } from "./order.entity"
import { User } from "../user/user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { Orderbook } from "./orderbook.dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(TradingPair)
        private readonly tradingPairRepository: Repository<TradingPair>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findOrderBookByTradingPairId(tradingPairId: number): Promise<Orderbook> {
        const asks = await this.findAllAsksByTradingPairId(tradingPairId)
        const bids = await this.findAllBidsByTradingPairId(tradingPairId)
        const orderbook = new Orderbook()

        asks.forEach((ask: Order) =>
            orderbook.asks[ask.price] = orderbook.asks[ask.price] ?
                orderbook.asks[ask.price] + ask.quantity : ask.quantity
        )

        bids.forEach((bid: Order) =>
            orderbook.bids[bid.price] = orderbook.bids[bid.price] ?
                orderbook.bids[bid.price] + bid.quantity : bid.quantity
        )
    
        return orderbook
    }

    async findAllAsksByTradingPairId(tradingPairId: number): Promise<Order[]> {
        const tradingPair: TradingPair = await this.tradingPairRepository.findOne(tradingPairId)

        return await this.orderRepository.find({
            relations: ["tradingPair"],
            order: { price: "ASC" },
            where: { side: "ask", tradingPair: tradingPair }
        })
    }

    async findAllBidsByTradingPairId(tradingPairId: number): Promise<Order[]> {
        const tradingPair: TradingPair = await this.tradingPairRepository.findOne(tradingPairId)

        return await this.orderRepository.find({
            relations: ["tradingPair"],
            order: { price: "DESC" },
            where: { side: "bid", tradingPair: tradingPair }
        })
    }

    async findByUserId(userId: number): Promise<Order[]> {
        const user: User = await this.userRepository.findOne(userId)

        return await this.orderRepository.find({
            relations: ["tradingPair"],
            where: { user: user }
        })
    }
}
