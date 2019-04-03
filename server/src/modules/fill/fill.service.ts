import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Fill } from "./fill.entity"
import { User } from "../user/user.entity"
import { Order } from "../order/order.entity"
import { FillDto } from "./fill.dto"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { Holding } from "../holding/holding.entity"

@Injectable()
export class FillService {
  constructor(
    @InjectRepository(Fill)
    private readonly fillRepository: Repository<Fill>,
    @InjectRepository(Holding)
    private readonly holdingRepository: Repository<Holding>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: Repository<TradingPair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAndSave(fillDto: FillDto): Promise<Fill> {
    const fill = await this.fillRepository.create(fillDto)

    fill.user = await this.userRepository.findOneOrFail(fillDto.userId)
    fill.order = await this.orderRepository.findOneOrFail({
      relations: ["tradingPair"],
      where: { id: fillDto.orderId },
    })

    if (fill.quantity > fill.order.quantity)
      throw new UnprocessableEntityException(
        `Insufficient Volume in order: ${fill.order.id}`,
      )

    await this.processFill(fill)
    return await this.fillRepository.save(fill)
  }

  async findByOrderId(orderId: string): Promise<Fill[]> {
    const order: Order = await this.orderRepository.findOne(orderId)

    return await this.fillRepository.find({
      relations: ["order", "user"],
      where: { order },
    })
  }

  async findByUserId(userId: number): Promise<Fill[]> {
    const user: User = await this.userRepository.findOne(userId)

    return await this.fillRepository.find({
      relations: ["order", "user"],
      where: { user },
    })
  }

  private async processFill(fill: Fill): Promise<void> {
    const pair = await this.tradingPairRepository.findOneOrFail({
      relations: ["baseAsset", "toAsset"],
      where: { id: fill.order.tradingPair.id },
    })

    const holdings = await this.getUserHoldings(pair, fill.user.id)

    const cost = fill.quantity * fill.order.price
    const baseBalance = holdings[pair.baseAsset.symbol].balance || 0
    const toBalance = holdings[pair.toAsset.symbol].balance || 0

    switch (fill.order.side) {
      case "ask":
        if (baseBalance * fill.order.price - cost >= 0) {
          holdings[pair.baseAsset.symbol].balance -= cost
          holdings[pair.toAsset.symbol].balance += fill.quantity
          break
        }
      case "bid":
        if (toBalance - fill.quantity >= 0) {
          holdings[pair.toAsset.symbol].balance -= fill.quantity
          holdings[pair.baseAsset.symbol].balance += cost
          break
        }
      default:
        throw new UnprocessableEntityException(`Insufficient funds`)
    }

    fill.order.filled += fill.quantity
    fill.order.quantity -= fill.quantity

    if (fill.order.quantity === 0) {
      fill.order.open = false
    }

    await this.holdingRepository.save(holdings[pair.baseAsset.symbol])
    await this.holdingRepository.save(holdings[pair.toAsset.symbol])
    await this.orderRepository.save(fill.order)
  }

  private async getUserHoldings(
    pair: TradingPair,
    userId: number,
  ): Promise<{}> {
    return this.userRepository
      .findOne({
        relations: ["holdings", "holdings.asset"],
        where: { id: userId },
      })
      .then(user => {
        return user.holdings.reduce((acc, holding) => {
          const symbol = [pair.baseAsset, pair.toAsset].find(
            asset => asset.id === holding.asset.id,
          ).symbol
          acc[symbol] = holding
          return acc
        }, {})
      })
  }
}
