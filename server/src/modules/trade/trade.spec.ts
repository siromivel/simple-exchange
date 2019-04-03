import { Test, TestingModule } from "@nestjs/testing"
import { TradeService } from "./trade.service"
import { createConnection } from "typeorm"
import { Trade } from "./trade.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { User } from "../user/user.entity"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("TradeService", () => {
  let tradeModule: TestingModule
  let tradeService: TradeService

  beforeAll(async () => {
    const testConnection = await createConnection({
      type: "sqljs",
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      logging: false,
      dropSchema: true,
      synchronize: true,
    })

    const tradeRepository = testConnection.getRepository(Trade)
    const tradingPairRepository = testConnection.getRepository(TradingPair)
    const userRepository = testConnection.getRepository(User)

    tradeModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Trade),
          useValue: tradeRepository,
        },
        {
          provide: getRepositoryToken(TradingPair),
          useValue: tradingPairRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile()
  })

  describe("createAndSave", () => {})
})
