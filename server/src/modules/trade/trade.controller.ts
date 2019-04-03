import { Body, Controller, Post, UseInterceptors } from "@nestjs/common"
import { Trade } from "./trade.entity"
import { TradeDto } from "./trade.dto"
import { TradeService } from "./trade.service"
import { Transaction } from "typeorm"

@Controller("trades")
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post("trade")
  async submitTrade(@Body() trade: TradeDto): Promise<Trade> {
    return await this.tradeService.createAndSave(trade)
  }
}
