import { Injectable, Inject } from "@nestjs/common"
import { Repository } from "typeorm"
import { TradingPair } from "./trading_pair.entity"

@Injectable()
export class TradingPairService {
    constructor(
        @Inject('TradingPairRepository')
        private readonly tradingPairRepository: Repository<TradingPair>
    ) {}

    async findAll(): Promise<TradingPair[]> {
        return await this.tradingPairRepository.find({
            cache: true,
            relations: ['baseAsset', 'toAsset']
        })
    }
}
