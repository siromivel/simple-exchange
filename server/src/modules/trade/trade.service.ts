import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, getConnection } from "typeorm"
import { Trade } from "./trade.entity"
import { User } from "../user/user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { TradeDto } from "./trade.dto"
import { Holding } from "../holding/holding.entity"

@Injectable()
export class TradeService {
  constructor(
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
      where: { tradingPairId: tradeDto.tradingPairId },
    })

    let holdings = await this.getUserHoldings(
      trade.tradingPair,
      trade.user.id,
    ).then(holdings => this.updateHoldings(trade, holdings))

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

  private async saveTradeAndHoldings(trade: Trade, holdings: {}): Promise<Trade> {
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

  private updateHoldings(trade: Trade, holdings: {}): {} {
    const baseSymbol = trade.tradingPair.baseAsset.symbol
    const baseBalance = holdings[baseSymbol].balance || 0

    const toSymbol = trade.tradingPair.toAsset.symbol
    const toBalance = holdings[toSymbol].balance || 0

    if (trade.type === "buy") {
      if (baseBalance - trade.quantity * trade.price < 0)
        throw new UnprocessableEntityException(
          `Insufficient ${baseSymbol} to execute trade`,
        )
      holdings[baseSymbol].balance -= trade.quantity * trade.price
      holdings[toSymbol].balance += trade.quantity
    } else if (trade.type === "sell") {
      if (toBalance - trade.quantity < 0)
        throw new UnprocessableEntityException(
          `Insufficient ${toSymbol} to execute trade`,
        )
      holdings[toSymbol].balance -= trade.quantity
      holdings[baseSymbol].balance += trade.quantity * trade.price
    }

    return holdings
  }
}
