import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage } from "@nestjs/websockets"
import * as SignalR from "signalr-client"
import * as zlib from "zlib"
import { InjectRepository } from "@nestjs/typeorm";
import { TradingPair } from "../trading_pair/trading_pair.entity";
import { Repository } from "typeorm";

@WebSocketGateway(8080)
export class PriceGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server

    pairs: any
    clients = []

    constructor(@InjectRepository(TradingPair) private readonly tradingPairRepository: Repository<TradingPair>) {
        this.getSupportedTradingPairs()
        this.subscribeToPriceFeed()
    }

    async handleConnection(client) {
        this.clients.push(client)
        this.server.emit("price", this.pairs)
    }

    async handleDisconnect(client) {
        this.clients = this.clients.filter(c => c.id !== client.id )
    }

    @SubscribeMessage("price")
    async onPriceUpdate() {
        this.server.emit("price", this.pairs)
    }

    private getSupportedTradingPairs() {
        return this.tradingPairRepository.find({
            relations: ["baseAsset", "toAsset"]
        }).then(pairs => pairs.reduce((acc, pair) => {
            const pairKey = pair.baseAsset.symbol + "-" + pair.toAsset.symbol
            acc[pairKey] = { pair: pair, price: NaN }
            return acc
        }, {}))
    }

    private async subscribeToPriceFeed() {
        this.pairs = await this.getSupportedTradingPairs()        

        const trexClient = new SignalR.client("wss://socket.bittrex.com/signalr", ['c2'], 10, true)
        trexClient.start()
    
        trexClient.serviceHandlers = {
            connected: () => {
                trexClient
                    .call('c2', 'QuerySummaryState')
                    .done((err: Error, result: any) => {
                        if (err) console.error(err)
                        if (result.utf8Data) this.handleMessage(result)
                    })

                trexClient.call('c2', 'SubscribeToSummaryLiteDeltas')
                    .done((err: Error, result: any) => {
                        if (err) console.error(err)
                        if (result) console.info('subscribed to bittrex summary deltas')
                    })
            },

            messageReceived: (message: any) => {
                this.handleMessage(message)
            }
        }
    }

    private handleMessage(message: any) {
        let debased = Buffer.from(message.utf8Data)
        let data = JSON.parse(debased.toString())

        if (data && data.M) {
            data.M.forEach((M: any) => {
                let delta = Buffer.from(M.A[0], 'base64')

                zlib.inflateRaw(delta, (err: Error | null, d) => {
                    if (err) console.error(err)
                    try {
                        let parsed = JSON.parse(d.toString())
                        if (parsed["D"]) this.updatePrices(parsed["D"])
                    } catch(e) {
                        console.error(e)
                    }
                })
            })
        }
    }

    private async updatePrices(priceData: any[]) {
        if (this.pairs) {
            priceData.forEach((pair) => {
                if (this.pairs[pair["M"]]) this.pairs[pair["M"]].price = pair["l"]
            })
            this.server.emit("price", this.pairs)
        }
    }
}
