import { Controller, Get, Param, Post, Body } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./user.entity"
import { UserDto } from "./user.dto"

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

  @Post(":new")
  async createUser(@Body("userDto") userDto: UserDto): Promise<User> {
    return this.userService.createAndSave(userDto)
  }
}
