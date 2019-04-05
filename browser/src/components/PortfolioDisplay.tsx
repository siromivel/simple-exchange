import React, { PureComponent } from "react"
import { HoldingsList } from "./HoldingsList"
import { User } from "../types/User"
import { Holding } from "../types/Holding"
import { Dictionary } from "../types/Dictionary"

export class PortfolioDisplay extends PureComponent<{
  pairMap: Dictionary
  user: User
}> {
  constructor(props: { pairMap: Dictionary; user: User }) {
    super(props)
  }

  calculatePortfolioBtcValue() {
    return this.props.user.holdings.reduce(
      (sum, holding) => sum + this.calculateBtcValueOfHolding(holding),
      0,
    )
  }

  calculatePortfolioUsdValue() {
    return this.props.user.holdings.reduce(
      (sum, holding) => sum + this.calculateUsdValueOfHolding(holding),
      0,
    )
  }

  calculateBtcValueOfHolding(holding: Holding): number {
    const BTCPrice = this.props.pairMap["USD-BTC"].price

    if (holding.asset.symbol === "BTC") return holding.balance
    if (holding.asset.symbol === "USD") return holding.balance / BTCPrice

    for (const pair in this.props.pairMap) {
      if (
        this.props.pairMap[pair].pair.toAsset.symbol === holding.asset.symbol
      ) {
        return holding.balance * this.props.pairMap[pair].price
      }
    }
    return 0
  }

  calculateUsdValueOfHolding(holding: Holding): number {
    const BTCPrice = this.props.pairMap["USD-BTC"].price

    if (holding.asset.symbol === "USD") return holding.balance
    if (holding.asset.symbol === "BTC") return holding.balance * BTCPrice

    for (const pair in this.props.pairMap) {
      if (
        this.props.pairMap[pair].pair.toAsset.symbol === holding.asset.symbol
      ) {
        return holding.balance * this.props.pairMap[pair].price * BTCPrice
      }
    }
    return 0
  }

  render() {
    return (
      <div>
        <h2>
          {this.props.user.name.split("").pop() === "s"
            ? this.props.user.name + "' "
            : this.props.user.name + "'s "}
          Holdings
        </h2>
        <HoldingsList holdings={this.props.user.holdings} />
        {this.props.pairMap["USD-BTC"] ? (
          <div>
            <h4>
              Total Portfolio Value in Bitcoin:{" "}
              {this.calculatePortfolioBtcValue()}
            </h4>
            <h4>
              Total Portfolio Value in US Dollars:{" "}
              {this.calculatePortfolioUsdValue()}
            </h4>
          </div>
        ) : (
          ""
        )}
      </div>
    )
  }
}
