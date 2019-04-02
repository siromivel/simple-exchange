import { Controller, Get, Param } from "@nestjs/common";
import { Order } from "./order.entity";
import { OrderService } from "./order.service";

@Controller("orders")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get(":userId")
    async findByUserId(@Param("userId") userId): Promise<Order[]> {
        return await this.orderService.findByUserId(userId)
    }
}
