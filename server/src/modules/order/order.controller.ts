import { Controller, Get, Param, Post, Body } from "@nestjs/common"
import { OrderService } from "./order.service"
import { FillService } from "../fill/fill.service"
import { Fill } from "../fill/fill.entity"
import { FillDto } from "../fill/fill.dto"

@Controller("orders")
export class OrderController {
    constructor(
        private readonly fillService: FillService,
        private readonly orderService: OrderService
    ) {}

    @Post("fill")
    async fillOrder(@Body() fill: FillDto): Promise<Fill> {
        return await this.fillService.createAndSave(fill)
    }

    @Get(":id/fills")
    async findFillsByOrderId(@Param("id") id: string): Promise<Fill[]> {
        return await this.fillService.findByOrderId(id)
    }
}
