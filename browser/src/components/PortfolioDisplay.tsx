import React, { PureComponent } from "react"
import { HoldingsList } from "./HoldingsList"
import { User } from "../types/User"
import { Holding } from "../types/Holding"
import { Dictionary } from "../types/Dictionary"

export class PortfolioDisplay extends PureComponent<{
  Dictionary: Dictionary
  user: User
}> {
  constructor(props: { Dictionary: Dictionary; user: User }) {
    super(props)
  }

  calculatePortfolioValue() {
    return this.props.user.holdings.reduce(
      (sum, holding) => sum + this.calculateUsdValueOfHolding(holding),
      0,
    )
  }

  calculateUsdValueOfHolding(holding: Holding): number {
    const BTCPrice = this.props.Dictionary["USD-BTC"].price

    if (holding.asset.symbol === "USD") return holding.balance
    if (holding.asset.symbol === "BTC") return holding.balance * BTCPrice

    for (const pair in this.props.Dictionary) {
      if (
        this.props.Dictionary[pair].pair.toAsset.symbol === holding.asset.symbol
      ) {
        return holding.balance * this.props.Dictionary[pair].price * BTCPrice
      }
    }
    return 0
  }

  render() {
    return (
      <div>
        {this.props.user.name.split("").pop() === "s"
          ? this.props.user.name + "'"
          : this.props.user.name + "'s"}{" "}
        Holdings
        <HoldingsList holdings={this.props.user.holdings} />
        <h4>
          Total Portfolio Value in US Dollars: {this.calculatePortfolioValue()}
        </h4>
      </div>
    )
  }
}
