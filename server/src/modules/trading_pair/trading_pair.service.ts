import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { TradingPair } from "./trading_pair.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class TradingPairService {
    constructor(
        @InjectRepository(TradingPair)
        private readonly tradingPairRepository: Repository<TradingPair>
    ) {}

    async findAll(): Promise<TradingPair[]> {
        return await this.tradingPairRepository.find({
            cache: true,
            relations: ["baseAsset", "toAsset"]
        })
    }
}
