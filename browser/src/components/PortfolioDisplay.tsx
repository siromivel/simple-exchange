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

  calculatePortfolioBTCValue() {
    return this.props.user.holdings.reduce(
      (sum, holding) => sum + this.calculateBTCValueOfHolding(holding),
      0,
    )
  }

  calculatePortfolioUSDValue() {
    return this.props.user.holdings.reduce(
      (sum, holding) => sum + this.calculateUSDValueOfHolding(holding),
      0,
    )
  }

  calculateBTCValueOfHolding(holding: Holding): number {
    const BTCPrice = this.props.Dictionary["USD-BTC"].price

    if (holding.asset.symbol === "BTC") return holding.balance
    if (holding.asset.symbol === "USD") return holding.balance / BTCPrice

    for (const pair in this.props.Dictionary) {
      if (
        this.props.Dictionary[pair].pair.toAsset.symbol === holding.asset.symbol
      ) {
        return holding.balance * this.props.Dictionary[pair].price
      }
    }
    return 0
  }

  calculateUSDValueOfHolding(holding: Holding): number {
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
        <h2>
          {this.props.user.name.split("").pop() === "s"
            ? this.props.user.name + "'"
            : this.props.user.name + "'s"}{" "}
          Holdings
        </h2>
        <HoldingsList holdings={this.props.user.holdings} />
        <h4>
          Total Portfolio Value in Bitcoin: {this.calculatePortfolioBTCValue()}
        </h4>
        <h4>
          Total Portfolio Value in US Dollars:{" "}
          {this.calculatePortfolioUSDValue()}
        </h4>
      </div>
    )
  }
}
