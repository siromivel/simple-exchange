import { Controller, Get, Param } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./user.entity"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll()
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<User> {
    return this.userService.findOne(id)
  }
}
