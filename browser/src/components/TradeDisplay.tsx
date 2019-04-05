import React, { PureComponent } from "react"
import { Input } from "./FormComponents/Input"
import { Button } from "./FormComponents/Button"
import { Select } from "./FormComponents/Select"
import { TradingPairSelector } from "./TradingPairSelector"
import { Trade } from "../types/Trade"
import { OptionProps } from "../types/OptionProps"
import { Dictionary } from "../types/Dictionary"
import { User } from "../types/User"

export class TradeDisplay extends PureComponent<
  { user: User; pairMap: Dictionary; onTrade: Function },
  {
    activePair: string
    quantity: number
    type: string
    typeList: ["buy", "sell"]
    tradeExecuted: boolean
    tradeExecutionError: boolean
  }
> {
  constructor(props: { user: User; pairMap: Dictionary; onTrade: Function }) {
    super(props)

    this.clearTrade = this.clearTrade.bind(this)
    this.handleQuantityChange = this.handleQuantityChange.bind(this)
    this.handlePairChange = this.handlePairChange.bind(this)
    this.handleSubmitTrade = this.handleSubmitTrade.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)

    this.state = {
      tradeExecutionError: false,
      quantity: 0,
      activePair: "USD-BTC",
      type: "",
      typeList: ["buy", "sell"],
      tradeExecuted: false,
    }
  }

  clearTrade() {
    this.setState({
      quantity: 0,
      type: "",
      tradeExecuted: false,
      tradeExecutionError: false,
    })
  }

  async handleSubmitTrade() {
    this.setState({ tradeExecuted: false, tradeExecutionError: false })

    const trade: Trade = {
      type: this.state.type,
      price: this.props.pairMap[this.state.activePair].price,
      quantity: this.state.quantity || 0,
      tradingPairId: this.props.pairMap[this.state.activePair].pair.id,
      userId: this.props.user.id,
    }

    if (trade.type) {
      await fetch(`${process.env.REST_API}/trades/trade`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        redirect: "error",
        body: JSON.stringify(trade),
      })
        .then(res => res.json())
        .then(json =>
          !json.statusCode
            ? this.setState({ tradeExecuted: true })
            : this.setState({
                tradeExecuted: false,
                tradeExecutionError: true,
              }),
        )

      return this.props.onTrade(
        await fetch(`${process.env.REST_API}/users/${this.props.user.id}`).then(
          response => response.json(),
        ),
      )
    }
  }

  handlePairChange(activePair: string) {
    this.clearTrade()
    this.setState({ activePair })
  }

  handleTypeChange(event: React.FormEvent<HTMLSelectElement>) {
    this.setState({ type: event.currentTarget.value })
  }

  handleQuantityChange(quantity: number) {
    quantity = quantity || 0
    this.setState({
      quantity,
      tradeExecutionError: false,
      tradeExecuted: false,
    })
  }

  getTypeOptions(): OptionProps[] {
    return this.state.typeList.map(type => {
      return {
        title: type,
        value: type,
      }
    })
  }

  render() {
    return (
      <div className="trade-form">
        <h3>Trade</h3>
        <TradingPairSelector
          activePair={this.state.activePair}
          pairMap={this.props.pairMap}
          onSelectTradingPair={this.handlePairChange}
        />
        <Select
          name="type"
          title="Type"
          placeholder=""
          value={this.state.type}
          options={this.getTypeOptions()}
          handleChange={this.handleTypeChange}
        />
        <Input
          name="quantity"
          title="quantity"
          type="text"
          min={0}
          max={1000000000}
          handleChange={this.handleQuantityChange}
          placeholder=""
          value={this.state.quantity}
        />
        <Button
          title="Submit"
          action={this.handleSubmitTrade}
          disabled={!this.state.type || this.state.quantity <= 0}
        />
        <Button title="Clear" action={this.clearTrade} />
        {this.state.tradeExecuted ? (
          <span color="green">Trade Executed Successfully</span>
        ) : (
          ""
        )}
        {this.state.tradeExecutionError ? (
          <span color="red">Trade Execution Error</span>
        ) : (
          ""
        )}
      </div>
    )
  }
}
