import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { Holding } from "./holding.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";

@Injectable()
export class HoldingService {
    constructor(
        @InjectRepository(Holding)
        private readonly holdingRepository: Repository<Holding>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findByUserId(userId: number): Promise<Holding[]> {
        const user: User = await this.userRepository.findOne(userId)

        return await this.holdingRepository.find({
            cache: true,
            relations: ["asset"],
            where: { user: user }
        })
    }
}
