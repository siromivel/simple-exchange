import { Injectable, Inject } from "@nestjs/common"
import { Repository } from "typeorm"
import { Asset } from "./asset.entity"

@Injectable()
export class AssetService {
    constructor(
        @Inject('AssetRepository')
        private readonly assetRepository: Repository<Asset>
    ) {}

    async findAll(): Promise<Asset[]> {
        return await this.assetRepository.find({ cache: true })
    }
}
