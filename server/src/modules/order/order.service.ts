import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { User } from "../user/user.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findByUserId(userId: number): Promise<Order[]> {
        const user: User = await this.userRepository.findOne(userId)

        return await this.orderRepository.find({
            cache: false,
            relations: ["tradingPair"],
            where: { user: user }
        })
    }
}
