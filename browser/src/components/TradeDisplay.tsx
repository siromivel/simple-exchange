import React, { PureComponent, FormEvent } from "react";
import { Input } from "./FormComponents/Input";
import { Button } from "./FormComponents/Button";
import { Select } from "./FormComponents/Select";
import { TradingPairSelector } from "./TradingPairSelector";
import { TradingPair } from "../types/TradingPair";
import { Trade } from "../types/Trade";
import { OptionProps } from "../types/OptionProps";
import { Prices } from "../types/Prices";

export class TradeDisplay extends PureComponent<{ userId: number, pairs: any }, { tradingPairId: number, quantity: number, type: string, typeList: ["buy", "sell"], tradeExecuted: boolean, tradeExecutionError: boolean }> {
    constructor(props: { userId: number, pairs: Prices }) {
        super(props)

        this.clearTrade = this.clearTrade.bind(this)
        this.handleQuantityChange = this.handleQuantityChange.bind(this)
        this.handlePairChange = this.handlePairChange.bind(this)
        this.handleSubmitTrade = this.handleSubmitTrade.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
    
        this.state = {
            tradeExecutionError: false,
            quantity: 0,
            tradingPairId: 1,
            type: "",
            typeList: ["buy", "sell"],
            tradeExecuted: false
        }
    }

    async componentDidMount() {
        const tradingPairs = await fetch("http://localhost:3000/pairs").then(res => res.json())
        const tradingPair = tradingPairs.find((pair: TradingPair) => pair.id === 1)

        await this.setState({
            tradingPairId: tradingPair.id
        })
    }

    clearTrade() {
        this.setState({ quantity: 0, type: "", tradeExecuted: false, tradeExecutionError: false })
    }

    async handleSubmitTrade() {
        this.setState({ tradeExecuted: false, tradeExecutionError: false })
        const trade: Trade = {
            type: this.state.type,
            price: this.props.pairs["USD-BTC"].price,
            quantity: this.state.quantity || 0,
            tradingPairId: this.state.tradingPairId,
            userId: this.props.userId
        }

        if (trade.type) {
            return await fetch("http://localhost:3000/trades/trade", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                redirect: "error",
                body: JSON.stringify(trade)
            }).then(res => res.json()
            ).then(json => !json.statusCode ? this.setState({ tradeExecuted: true }) : this.setState({ tradeExecuted: false, tradeExecutionError: true }))
        }
    }

    handlePairChange(tradingPairId: number) {
        this.clearTrade()
        this.setState({ tradingPairId })
    }

    handleTypeChange(type: string) {
        this.setState({ type })
    }

    handleQuantityChange(quantity: number) {
        quantity = quantity || 0
        this.setState({ quantity, tradeExecutionError: false, tradeExecuted: false })
    }

    getTypeOptions(): OptionProps[] {
        return this.state.typeList.map(type => {
            return {
                title: type,
                value: type
            }
        })
    }

    render() {
        return (
            <div className="trade-form">
                <h3>Trade</h3>
                <TradingPairSelector onSelectTradingPair={this.handlePairChange}/>
                <Select name="type" title="Type" placeholder="" value={this.state.type} options={this.getTypeOptions()} handleChange={(e: any) => this.handleTypeChange(e.target.value)} />
                <Input name="quantity" title="quantity" type="number" min={0} max={1000000000} handleChange={this.handleQuantityChange} placeholder="0" value={this.state.quantity}/>
                <Button title="Submit" action={this.handleSubmitTrade} disabled={(!this.state.type || this.state.quantity <= 0)}/>
                <Button title="Clear" action={this.clearTrade}/> 
                { this.state.tradeExecuted ? <span color="green">Trade Executed Successfully</span> : "" }
                { this.state.tradeExecutionError ? <span color="red">Trade Execution Error</span> : "" }
            </div>
        )
    }
}
