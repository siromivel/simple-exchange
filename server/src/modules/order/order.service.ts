import {
  Injectable,
  UnprocessableEntityException,
  ForbiddenException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Order } from "./order.entity"
import { User } from "../user/user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { Orderbook } from "./orderbook.dto"
import { OrderDto } from "./order.dto"
import { Holding } from "../holding/holding.entity"

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Holding)
    private readonly holdingRepository: Repository<Holding>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: Repository<TradingPair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.orderRepository.findOneOrFail(orderId)
    const user = await this.userRepository.findOneOrFail(userId)

    if (user.id !== order.user.id) throw new ForbiddenException("Verboten")

    let holding = user.holdings.find(
      holding => holding.asset.symbol === order.tradingPair.baseAsset.symbol,
    )

    if (!holding) {
      holding = new Holding()
      holding.user = user
      holding.balance = 0
    }

    if (order.side === "ask") {
      holding.balance += order.quantity
    } else if (order.side === "bid") {
      holding.balance += order.quantity * order.price
    }

    order.open = false

    await this.holdingRepository.save(holding)
    return await this.orderRepository.save(order)
  }

  async createAndSave(orderDto: OrderDto): Promise<Order> {
    const order = await this.orderRepository.create(orderDto)

    order.user = await this.userRepository.findOneOrFail(orderDto.userId)
    order.tradingPair = await this.tradingPairRepository.findOneOrFail(
      orderDto.tradingPairId,
    )

    let holding: Holding

    switch (order.side) {
      case "ask":
        holding = order.user.holdings.find(
          holding =>
            holding.asset.symbol === order.tradingPair.baseAsset.symbol,
        )
        if (holding.balance - order.quantity < 0) {
          holding.balance -= order.quantity
          break
        }
      case "bid":
        holding = order.user.holdings.find(
          holding => holding.asset.symbol === order.tradingPair.toAsset.symbol,
        )
        if (holding.balance * order.price - order.quantity < 0) {
          holding.balance -= order.quantity * order.price
          break
        }
      default:
        throw new UnprocessableEntityException("Insufficient Funds")
    }

    await this.holdingRepository.save(holding)
    return await this.orderRepository.save(order)
  }

  async findById(id: string): Promise<Order> {
    return await this.orderRepository.findOne(id)
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const user: User = await this.userRepository.findOne(userId)

    return await this.orderRepository.find({
      relations: ["tradingPair"],
      where: { user },
    })
  }

  async findOrderBookByTradingPairId(
    tradingPairId: number,
  ): Promise<Orderbook> {
    const asks = await this.findAllAsksByTradingPairId(tradingPairId)
    const bids = await this.findAllBidsByTradingPairId(tradingPairId)
    const orderbook = new Orderbook()

    asks.forEach(
      (ask: Order) =>
        (orderbook.asks[ask.price] = orderbook.asks[ask.price]
          ? orderbook.asks[ask.price] + ask.quantity
          : ask.quantity),
    )

    bids.forEach(
      (bid: Order) =>
        (orderbook.bids[bid.price] = orderbook.bids[bid.price]
          ? orderbook.bids[bid.price] + bid.quantity
          : bid.quantity),
    )

    return orderbook
  }

  async findAllAsksByTradingPairId(tradingPairId: number): Promise<Order[]> {
    const tradingPair: TradingPair = await this.tradingPairRepository.findOne(
      tradingPairId,
    )

    return await this.orderRepository.find({
      relations: ["tradingPair"],
      order: { price: "ASC" },
      where: { side: "ask", tradingPair },
    })
  }

  async findAllBidsByTradingPairId(tradingPairId: number): Promise<Order[]> {
    const tradingPair: TradingPair = await this.tradingPairRepository.findOne(
      tradingPairId,
    )

    return await this.orderRepository.find({
      relations: ["tradingPair"],
      order: { price: "DESC" },
      where: { side: "bid", tradingPair },
    })
  }
}
