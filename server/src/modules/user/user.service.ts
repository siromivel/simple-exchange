import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { User } from "./user.entity"
import { UserDto } from "./user.dto"
import { Asset } from "../asset/asset.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Holding } from "../holding/holding.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Holding)
    private readonly holdingRepository: Repository<Holding>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAndSave(userDto: UserDto): Promise<User> {
    let user = await this.userRepository.create(userDto)
    user = await this.userRepository.save(user)

    const usdAsset = await this.assetRepository.findOneOrFail({
      where: { symbol: "USD" },
    })
    const usdHolding = await this.holdingRepository.create({
      asset: usdAsset,
      balance: 10000,
      user: user,
    })
    usdHolding.user = user
    await this.holdingRepository.save(usdHolding)

    return await this.userRepository.findOneOrFail({
      relations: ["holdings", "holdings.asset"],
      where: { id: user.id },
    })
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      cache: true,
    })
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail({
      relations: [
        "holdings",
        "holdings.asset",
        "trades",
        "trades.tradingPair",
        "trades.tradingPair.baseAsset",
        "trades.tradingPair.toAsset",
      ],
      where: { id },
    })
  }
}
