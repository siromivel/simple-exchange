import { Controller, Get } from "@nestjs/common"
import { FillService } from "./fill.service"

@Controller("fills")
export class FillController {
  constructor(private readonly fillService: FillService) {}
}
