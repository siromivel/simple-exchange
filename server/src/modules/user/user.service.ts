import { Injectable, Inject } from "@nestjs/common"
import { Repository } from "typeorm"
import { User } from "./user.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      cache: true,
    })
  }

  async getUserHoldings(pair: TradingPair, userId: number): Promise<{}> {
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
