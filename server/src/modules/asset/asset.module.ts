import { Module } from "@nestjs/common"
import { assetProviders } from "./asset.providers"
import { AssetService } from "./asset.service"

@Module({
    imports: [],
    providers: [AssetService, ...assetProviders],
    exports: [AssetService]
})

export class AssetModule{}
