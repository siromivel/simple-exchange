import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { createConnection, Connection } from "typeorm"
import { User } from "./user.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { UserService } from "./user.service"
import { AssetService } from "../asset/asset.service"
import { HoldingService } from "../holding/holding.service"
import { Asset } from "../asset/asset.entity"
import { Holding } from "../holding/holding.entity"

describe("UserController", () => {
  let testConnection: Connection
  let assetService: AssetService
  let holdingService: HoldingService
  let userController: UserController
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
    const userRepository = testConnection.getRepository(User)

    const userModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile()

    userController = userModule.get<UserController>(UserController)
    userService = userModule.get<UserService>(UserService)
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
  })

  afterEach(async () => {
    await testConnection.dropDatabase()
    await testConnection.synchronize()
  })

  it("should create a new user with 10000 USD in holdings", async () => {
    const expected = {
      id: 1,
      name: "Elmo",
      holdings: [
        {
          asset: { id: 2, name: "US Dollar", symbol: "USD" },
          balance: 10000,
          id: 1,
        },
      ],
    }

    const result = await userController.createUser({ name: "Elmo" })
    expect(result).toEqual(expected)
  })

  it("should get a list of all users", async () => {
    await testConnection
      .createQueryRunner()
      .query(`INSERT INTO exchange_user(name) VALUES ('Kat'), ('Jimbo')`)

    const expected = [{ id: 1, name: "Kat" }, { id: 2, name: "Jimbo" }]
    const result = await userController.findAll()
    expect(result).toEqual(expected)
  })

  it("should get a particular user with holdings and trades", async () => {
    await testConnection
      .createQueryRunner()
      .query(`INSERT INTO exchange_user(name) VALUES ('Kat'), ('Jimbo')`)
    await testConnection.createQueryRunner().query(
      `INSERT INTO holding (balance, asset_id, exchange_user_id)
          VALUES (10000, 2, 2)
         `,
    )

    const expected = {
      id: 2,
      name: "Jimbo",
      holdings: [
        {
          asset: {
            id: 2,
            name: "US Dollar",
            symbol: "USD",
          },
          balance: 10000,
          id: 1,
        },
      ],
      trades: [],
    }

    const result = await userController.findOne(expected.id)
    expect(result).toEqual(expected)
  })
})
