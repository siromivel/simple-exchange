import React, { PureComponent } from "react"
import { Select } from "./FormComponents/Select"
import { TradingPair } from "../types/TradingPair"
import { OptionProps } from "../types/OptionProps"
import { Dictionary } from "../types/Dictionary"

export class TradingPairSelector extends PureComponent<{
  onSelectTradingPair: Function
  pairMap: Dictionary
  activePair: string
}> {
  constructor(props: {
    onSelectTradingPair: Function
    pairMap: Dictionary
    activePair: string
  }) {
    super(props)

    this.state = {
      tradingPairId: 1,
    }

    this.updateTradingPair = this.updateTradingPair.bind(this)
  }

  async componentDidMount() {
    const tradingPairList = await fetch("http://localhost:3000/pairs")
      .then((response: Response) => response.json())
      .then(json => json.sort((pair: TradingPair) => pair.id))

    await this.setState({ tradingPairList })
  }

  getTradingPairOptions(): OptionProps[] {
    const options: OptionProps[] = []

    for (const pairName in this.props.pairMap) {
      if (this.props.pairMap[pairName].price) {
        options.push({
          title: `${this.props.pairMap[pairName].pair.baseAsset.symbol}:${
            this.props.pairMap[pairName].pair.toAsset.symbol
          }`,
          value: pairName,
        })
      }
    }
    return options
  }

  async updateTradingPair(event: React.FormEvent<HTMLSelectElement>) {
    await this.props.onSelectTradingPair(event.currentTarget.value)
  }

  render() {
    return (
      <Select
        name="pair"
        title="Trading Pair"
        options={this.getTradingPairOptions()}
        handleChange={this.updateTradingPair}
        placeholder="Select Pair"
        value={this.props.activePair}
      />
    )
  }
}
