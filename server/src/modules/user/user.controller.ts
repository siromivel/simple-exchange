import { Controller, Get } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./user.entity"

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("all")
    async findAll(): Promise<User[]> {
        return await this.userService.findAll()
    }
}
