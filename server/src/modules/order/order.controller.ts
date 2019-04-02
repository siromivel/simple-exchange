import { Controller, Get, Param } from "@nestjs/common"
import { OrderService } from "./order.service"
import { FillService } from "../fill/fill.service"
import { Fill } from "../fill/fill.entity"

@Controller("orders")
export class OrderController {
    constructor(
        private readonly fillService: FillService,
        private readonly orderService: OrderService
    ) {}

    @Get(":id/fills")
    async findFillsByOrderId(@Param("id") id: string): Promise<Fill[]> {
        return await this.fillService.findFillsByOrderId(id)
    }
}
