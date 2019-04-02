import { Controller, Get } from "@nestjs/common";
import { Holding } from "./holding.entity";
import { HoldingService } from "./holding.service";

@Controller("holdings")
export class HoldingController {
    constructor(private readonly holdingService: HoldingService) {}

    @Get('')
    async findAll(): Promise<Holding[]> {
        return await this.holdingService.findAll()
    }
}
