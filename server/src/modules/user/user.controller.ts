import { Controller, Get, Param } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./user.entity"
import { OrderService } from "../order/order.service";
import { Order } from "../order/order.entity";
import { FillService } from "../fill/fill.service";
import { Fill } from "../fill/fill.entity";

@Controller("users")
export class UserController {
    constructor(
        private readonly fillService: FillService,
        private readonly orderService: OrderService,
        private readonly userService: UserService
    ) {}

    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll()
    }

    @Get(":id/fills")
    async findFillsByUserId(@Param("id") userId: number): Promise<Fill[]> {
        return await this.fillService.findByUserId(userId)
    }

    @Get(":id/orders")
    async findOrdersByUserId(@Param("id") userId: number): Promise<Order[]> {
        return await this.orderService.findByUserId(userId)
    }
}
