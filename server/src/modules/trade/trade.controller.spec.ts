import { Test, TestingModule } from "@nestjs/testing"
import { TradeService } from "./trade.service"
import { createConnection, Connection } from "typeorm"
import { Trade } from "./trade.entity"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { User } from "../user/user.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { UserService } from "../user/user.service"
import { TradingPairService } from "../trading_pair/trading_pair.service"
import { TradeController } from "./trade.controller"
import { HoldingService } from "../holding/holding.service"
import { Holding } from "../holding/holding.entity"
import { RedisService } from "../redis/redis.service.mock"
import { AssetService } from "../asset/asset.service"
import { Asset } from "../asset/asset.entity"

describe("TradeController", () => {
  let assetService: AssetService
  let holdingService: HoldingService
  let redisService: RedisService
  let testConnection: Connection
  let tradeController: TradeController
  let tradeModule: TestingModule
  let tradeService: TradeService
  let tradingPairService: TradingPairService
  let userService: UserService

  beforeAll(async () => {
    testConnection = await createConnection({
      type: "sqljs",
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      logging: false,
      dropSchema: true,
      synchronize: true,
    })

    const assetRepository = testConnection.getRepository(Asset)
    const holdingRepository = testConnection.getRepository(Holding)
    const tradeRepository = testConnection.getRepository(Trade)
    const tradingPairRepository = testConnection.getRepository(TradingPair)
    const userRepository = testConnection.getRepository(User)

    tradeModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [
        AssetService,
        {
          provide: getRepositoryToken(Asset),
          useValue: assetRepository,
        },
        HoldingService,
        {
          provide: getRepositoryToken(Holding),
          useValue: holdingRepository,
        },
        TradeService,
        {
          provide: getRepositoryToken(Trade),
          useValue: tradeRepository,
        },
        TradingPairService,
        {
          provide: getRepositoryToken(TradingPair),
          useValue: tradingPairRepository,
        },
        RedisService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile()

    redisService = tradeModule.get<RedisService>(RedisService)
    tradeController = tradeModule.get<TradeController>(TradeController)
    tradeService = tradeModule.get<TradeService>(TradeService)
  })

  beforeEach(async () => {
    await testConnection.createQueryRunner().query(
      `INSERT INTO asset (name, symbol)
        VALUES ('Bitcoin', 'BTC')`,
    )

    await testConnection.createQueryRunner().query(
      `INSERT INTO asset (name, symbol)
        VALUES ('US Dollar', 'USD')`,
    )

    await testConnection.createQueryRunner().query(
      `WITH us_dollar AS (SELECT id FROM asset WHERE symbol = 'USD'),
      bitcoin AS (SELECT id FROM asset WHERE symbol = 'BTC')

    INSERT INTO trading_pair (base_asset_id, to_asset_id)
     VALUES ((SELECT id FROM us_dollar), (SELECT id FROM bitcoin))`,
    )

    await testConnection
      .createQueryRunner()
      .query(`INSERT INTO exchange_user(name) VALUES ('Kat')`)

    await testConnection.createQueryRunner().query(
      `INSERT INTO holding (balance, asset_id, exchange_user_id)
        VALUES (10000, 2, 1)
       `,
    )
  })

  afterEach(async () => {
    await testConnection.dropDatabase()
    await testConnection.synchronize()
  })

  describe("submitTrade", () => {
    it("executes a buy and updates holdings", async () => {
      await redisService.redis.set(
        "latest_prices",
        JSON.stringify({
          "USD-BTC": {
            price: 9001,
          },
        }),
      )

      const tradeDto = {
        type: "buy",
        price: 9001,
        quantity: 1,
        tradingPairId: 1,
        userId: 1,
      }

      const expectedBtcHolding = {
        id: 2,
        balance: 1,
        asset_id: 1,
        exchange_user_id: 1,
      }
      const expectedUsdHolding = {
        id: 1,
        balance: 999,
        asset_id: 2,
        exchange_user_id: 1,
      }
      const expectedTrade = {
        id: 1,
        type: "buy",
        price: 9001,
        quantity: 1,
        tradingPair: {
          id: 1,
          baseAsset: { id: 2, name: "US Dollar", symbol: "USD" },
          toAsset: { id: 1, name: "Bitcoin", symbol: "BTC" },
        },
        user: { id: 1, name: "Kat" },
      }

      const resultTrade = await tradeController.submitTrade(tradeDto)
      const resultHoldings = await testConnection
        .createQueryRunner()
        .query(`SELECT * FROM holding WHERE exchange_user_id = 1`)

      expect(resultHoldings.find(holding => holding.asset_id === 1)).toEqual(
        expectedBtcHolding,
      )
      expect(resultHoldings.find(holding => holding.asset_id === 2)).toEqual(
        expectedUsdHolding,
      )
      expect(resultTrade).toEqual(expectedTrade)
    })

    it("executes a sell and updates holdings", async () => {
      await testConnection.createQueryRunner().query(
        `INSERT INTO holding (balance, asset_id, exchange_user_id)
          VALUES (1, 1, 1)
         `,
      )

      await redisService.redis.set(
        "latest_prices",
        JSON.stringify({
          "USD-BTC": {
            price: 9001,
          },
        }),
      )

      const tradeDto = {
        type: "sell",
        price: 9001,
        quantity: 1,
        tradingPairId: 1,
        userId: 1,
      }

      const expectedBtcHolding = {
        id: 2,
        balance: 0,
        asset_id: 1,
        exchange_user_id: 1,
      }
      const expectedUsdHolding = {
        id: 1,
        balance: 19001,
        asset_id: 2,
        exchange_user_id: 1,
      }
      const expectedTrade = {
        id: 1,
        type: "sell",
        price: 9001,
        quantity: 1,
        tradingPair: {
          id: 1,
          baseAsset: { id: 2, name: "US Dollar", symbol: "USD" },
          toAsset: { id: 1, name: "Bitcoin", symbol: "BTC" },
        },
        user: { id: 1, name: "Kat" },
      }

      const resultTrade = await tradeController.submitTrade(tradeDto)
      const resultHoldings = await testConnection
        .createQueryRunner()
        .query(`SELECT * FROM holding WHERE exchange_user_id = 1`)

      expect(resultHoldings.find(holding => holding.asset_id === 1)).toEqual(
        expectedBtcHolding,
      )
      expect(resultHoldings.find(holding => holding.asset_id === 2)).toEqual(
        expectedUsdHolding,
      )
      expect(resultTrade).toEqual(expectedTrade)
    })

    it("fails to buy if user has insufficient funds", async () => {
      await redisService.redis.set(
        "latest_prices",
        JSON.stringify({
          "USD-BTC": {
            price: 9001,
          },
        }),
      )

      const tradeDto = {
        type: "buy",
        price: 9001,
        quantity: 10,
        tradingPairId: 1,
        userId: 1,
      }

      const expectedUsdHolding = {
        id: 1,
        balance: 10000,
        asset_id: 2,
        exchange_user_id: 1,
      }

      await expect(tradeController.submitTrade(tradeDto)).rejects.toThrow(
        /Insufficient USD to execute trade/,
      )

      const resultHoldings = await testConnection
        .createQueryRunner()
        .query(`SELECT * FROM holding WHERE exchange_user_id = 1`)

      expect(resultHoldings.find(holding => holding.asset_id === 1)).toEqual(
        undefined,
      )
      expect(resultHoldings.find(holding => holding.asset_id === 2)).toEqual(
        expectedUsdHolding,
      )
    })

    it("fails to sell if user has insufficient funds", async () => {
      await redisService.redis.set(
        "latest_prices",
        JSON.stringify({
          "USD-BTC": {
            price: 9001,
          },
        }),
      )

      const tradeDto = {
        type: "sell",
        price: 9001,
        quantity: 1,
        tradingPairId: 1,
        userId: 1,
      }

      const expectedUsdHolding = {
        id: 1,
        balance: 10000,
        asset_id: 2,
        exchange_user_id: 1,
      }

      await expect(tradeController.submitTrade(tradeDto)).rejects.toThrow(
        /Insufficient BTC to execute trade/,
      )

      const resultHoldings = await testConnection
        .createQueryRunner()
        .query(`SELECT * FROM holding WHERE exchange_user_id = 1`)

      expect(resultHoldings.find(holding => holding.asset_id === 1)).toEqual(
        undefined,
      )
      expect(resultHoldings.find(holding => holding.asset_id === 2)).toEqual(
        expectedUsdHolding,
      )
    })

    it("fails if trade price doesn't match cached price", async () => {
      await redisService.redis.set(
        "latest_prices",
        JSON.stringify({
          "USD-BTC": {
            price: 9001,
          },
        }),
      )

      const tradeDto = {
        type: "buy",
        price: 3000,
        quantity: 1,
        tradingPairId: 1,
        userId: 1,
      }

      await expect(tradeController.submitTrade(tradeDto)).rejects.toThrow(
        /Invalid Price/,
      )

      const expectedUsdHolding = {
        id: 1,
        balance: 10000,
        asset_id: 2,
        exchange_user_id: 1,
      }

      const resultHoldings = await testConnection
        .createQueryRunner()
        .query(`SELECT * FROM holding WHERE exchange_user_id = 1`)

      expect(resultHoldings.find(holding => holding.asset_id === 1)).toEqual(
        undefined,
      )
      expect(resultHoldings.find(holding => holding.asset_id === 2)).toEqual(
        expectedUsdHolding,
      )
    })
  })
})
