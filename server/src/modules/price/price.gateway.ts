import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets"
import * as SignalR from "signalr-client"
import * as zlib from "zlib"
import { InjectRepository } from "@nestjs/typeorm"
import { TradingPair } from "../trading_pair/trading_pair.entity"
import { Repository } from "typeorm"
import { Inject } from "@nestjs/common"
import { RedisService } from "../redis/redis.service"
import { BittrexWsData } from "../../types/BittrexWsData.type"
import { BittrexMessage } from "../../types/BittrexMessage.type"
import { BittrexMessageWrapper } from "../../types/BittrexMessageWrapper"
import { BittrexLiteSummaryDelta } from "../../types/BittrexLiteSummaryDelta"
import { Dictionary } from "../../types/Dictionary"
import { BittrexLiteSummaryDeltas } from "src/types/BittrexLiteSummaryDeltas"

@WebSocketGateway(8080)
export class PriceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server

  pairs: Dictionary
  clients = []

  constructor(
    @Inject("RedisService")
    private readonly redisService: RedisService,
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: Repository<TradingPair>,
  ) {
    this.getSupportedTradingPairs()
    this.subscribeToPriceFeed()
  }

  async handleConnection(client) {
    this.clients.push(client)
    this.server.emit("price", this.pairs)
  }

  async handleDisconnect(client) {
    this.clients = this.clients.filter(c => c.id !== client.id)
  }

  @SubscribeMessage("price")
  async onPriceUpdate() {
    this.server.emit("price", this.pairs)
  }

  private getSupportedTradingPairs() {
    // Use mapping of pairs to make updating simple
    return this.tradingPairRepository
      .find({
        relations: ["baseAsset", "toAsset"],
      })
      .then(pairs =>
        pairs.reduce((acc, pair) => {
          const pairKey = pair.baseAsset.symbol + "-" + pair.toAsset.symbol
          acc[pairKey] = { pair: pair, price: NaN }
          return acc
        }, {}),
      )
  }

  private async subscribeToPriceFeed() {
    this.pairs = await this.getSupportedTradingPairs()
    const trexClient = new SignalR.client(
      process.env.BITTREX_WS,
      ["c2"],
      10,
      true,
    )
    trexClient.start()

    trexClient.serviceHandlers = {
      connected: () => {
        // Try to pull data for all pairs on connect; 95% of the time this call works every time
        trexClient
          .call("c2", "QuerySummaryState")
          .done((err: Error, result: BittrexWsData) => {
            if (err) console.error(err)
            if (result.utf8Data) this.handleMessage(result)
          })

        trexClient
          .call("c2", "SubscribeToSummaryLiteDeltas")
          .done((err: Error) => {
            if (err) console.error(err)
          })
      },

      messageReceived: (update: BittrexWsData) => {
        this.handleMessage(update)
      },
    }
  }

  private handleMessage(message: BittrexWsData) {
    const parsedMessage: BittrexMessageWrapper = JSON.parse(
      Buffer.from(message.utf8Data).toString(),
    )

    if (parsedMessage && parsedMessage.M) {
      parsedMessage.M.forEach((M: BittrexMessage) => {
        const rawDeltas: Buffer = Buffer.from(M.A[0], "base64")

        zlib.inflateRaw(rawDeltas, (err: Error | null, d) => {
          if (err) console.error(err)
          try {
            const deltas: BittrexLiteSummaryDeltas = JSON.parse(d.toString())
            if (deltas.D) this.updatePrices(deltas.D)
          } catch (e) {
            console.error(e)
          }
        })
      })
    }
  }

  private async updatePrices(priceData: BittrexLiteSummaryDelta[]) {
    if (this.pairs) {
      priceData.forEach(pair => {
        if (this.pairs[pair.M]) this.pairs[pair.M].price = pair.l
      })

      await this.redisService.redis.set(
        "latest_prices",
        JSON.stringify(this.pairs),
      )
      this.server.emit("price", this.pairs)
    }
  }
}
