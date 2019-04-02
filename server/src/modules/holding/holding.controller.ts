import { Controller, Get, Param } from "@nestjs/common";
import { Holding } from "./holding.entity";
import { HoldingService } from "./holding.service";

@Controller("holdings")
export class HoldingController {
    constructor(private readonly holdingService: HoldingService) {}

    @Get(':userId')
    async findByUserId(@Param("userId") userId): Promise<Holding[]> {
        return await this.holdingService.findByUserId(userId)
    }
}
