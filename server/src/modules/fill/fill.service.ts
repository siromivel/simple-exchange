import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Fill } from "./fill.entity"
import { User } from "../user/user.entity"
import { Order } from "../order/order.entity"

@Injectable()
export class FillService {
    constructor(
        @InjectRepository(Fill)
        private readonly fillRepository: Repository<Fill>,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findByOrderId(orderId: string): Promise<Fill[]> {
        const order: Order = await this.orderRepository.findOne(orderId)

        return await this.fillRepository.find({
            relations: ["order", "user"],
            where: { order: order }
        })
    }

    async findByUserId(userId: number): Promise<Fill[]> {
        const user: User = await this.userRepository.findOne(userId)

        return await this.fillRepository.find({
            relations: ["order", "user"],
            where: { user: user }
        })
    }
}
