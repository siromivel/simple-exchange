import {
  Injectable,
  UnprocessableEntityException,
  Inject,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, getConnection } from "typeorm"
import { Trade } from "./trade.entity"
import { User } from "../user/user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { TradeDto } from "./trade.dto"
import { Holding } from "../holding/holding.entity"
import { RedisService } from "../redis/redis.service"

@Injectable()
export class TradeService {
  constructor(
    @Inject("RedisService")
    private readonly redisService: RedisService,
    @InjectRepository(Holding)
    private readonly holdingRepository: Repository<Holding>,
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: Repository<TradingPair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAndSave(tradeDto: TradeDto): Promise<Trade> {
    const trade = await this.tradeRepository.create(tradeDto)
    trade.user = await this.userRepository.findOneOrFail(tradeDto.userId)
    trade.tradingPair = await this.tradingPairRepository.findOneOrFail({
      relations: ["baseAsset", "toAsset"],
      where: { id: tradeDto.tradingPairId },
    })

    const holdings: {} = await this.getUserHoldings(trade.user.id).then(
      async holdings => await this.updateHoldings(trade, holdings),
    )

    return this.saveTradeAndHoldings(trade, holdings)
  }

  async findByTradingPairId(tradingPairId: number): Promise<Trade[]> {
    const tradingPair = await this.tradingPairRepository.findOne(tradingPairId)

    return await this.tradeRepository.find({
      where: { tradingPair },
    })
  }

  async findByUserId(userId: number): Promise<Trade[]> {
    const user = await this.userRepository.findOne(userId)

    return await this.tradeRepository.find({
      where: { user },
    })
  }

  private async getUserHoldings(userId: number): Promise<{}> {
    return this.userRepository
      .findOne({
        relations: ["holdings", "holdings.asset"],
        where: { id: userId },
      })
      .then(user => {
        return user.holdings.reduce((acc, holding) => {
          acc[holding.asset.symbol] = holding
          return acc
        }, {})
      })
  }

  private async saveTradeAndHoldings(
    trade: Trade,
    holdings: {},
  ): Promise<Trade> {
    return await getConnection().transaction(async manager => {
      const holdingRepoInTx = manager.getRepository(Holding)
      const tradeRepoInTx = manager.getRepository(Trade)

      const saveHoldings = []
      for (const holding in holdings) {
        saveHoldings.push(holdingRepoInTx.save(holdings[holding]))
      }

      await Promise.all(saveHoldings)
      return await tradeRepoInTx.save(trade)
    })
  }

  private async createHoldingForTrade(
    symbol: string,
    trade: Trade,
  ): Promise<Holding> {
    const baseAsset = trade.tradingPair.baseAsset
    const toAsset = trade.tradingPair.toAsset

    const newHolding = await this.holdingRepository.create()
    newHolding.asset = symbol === baseAsset.symbol ? baseAsset : toAsset
    newHolding.user = trade.user
    newHolding.balance = 0

    return newHolding
  }

  private async updateHoldings(trade: Trade, holdings: {}): Promise<{}> {
    const baseSymbol = trade.tradingPair.baseAsset.symbol
    const toSymbol = trade.tradingPair.toAsset.symbol

    const latestQuote = await this.redisService.redis
      .get("latest_prices")
      .then((data: string) => JSON.parse(data)[`${baseSymbol}-${toSymbol}`])

    if (!latestQuote || !latestQuote.price || trade.price !== latestQuote.price)
      throw new UnprocessableEntityException("Invalid Price")

    if (!holdings[baseSymbol])
      holdings[baseSymbol] = await this.createHoldingForTrade(baseSymbol, trade)
    if (!holdings[toSymbol])
      holdings[toSymbol] = await this.createHoldingForTrade(toSymbol, trade)

    const baseBalance = holdings[baseSymbol].balance
    const toBalance = holdings[toSymbol].balance
    const quantity = +trade.quantity
    const price = +trade.price

    if (trade.type === "buy") {
      if (baseBalance - quantity * price < 0)
        throw new UnprocessableEntityException(
          `Insufficient ${baseSymbol} to execute trade`,
        )
      holdings[baseSymbol].balance -= quantity * price
      holdings[toSymbol].balance += quantity
    } else if (trade.type === "sell") {
      if (toBalance - quantity < 0)
        throw new UnprocessableEntityException(
          `Insufficient ${toSymbol} to execute trade`,
        )
      holdings[toSymbol].balance -= quantity
      holdings[baseSymbol].balance += quantity * price
    }

    return holdings
  }
}
