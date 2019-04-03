import { Injectable, Inject } from "@nestjs/common"
import { Repository } from "typeorm"
import { User } from "./user.entity"

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      cache: true,
    })
  }
}
