export class Orderbook {
    asks: {};
    bids: {};

    constructor(bids: {} = {}, asks: {} = {}) {
        this.asks = asks;
        this.bids = bids;
    }
}
