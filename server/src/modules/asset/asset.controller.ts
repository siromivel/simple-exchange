import { Controller, Get } from "@nestjs/common"
import { Asset } from "./asset.entity"
import { AssetService } from "./asset.service"

@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async findAll(): Promise<Asset[]> {
    return await this.assetService.findAll()
  }
}
