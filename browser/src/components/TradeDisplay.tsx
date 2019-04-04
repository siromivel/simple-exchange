import React, { PureComponent, FormEvent } from "react";
import { Input } from "./FormComponents/Input";
import { Button } from "./FormComponents/Button";
import { TradingPair } from "../types/TradingPair";
import { Select } from "./FormComponents/Select";
import { OptionProps } from "../types/OptionProps";
import { Trade } from "../types/Trade";
import { TradingPairSelector } from "./TradingPairSelector";

export class TradeDisplay extends PureComponent<{ userId: number }, { tradingPair: TradingPair | null, amount: number, type: string, typeList: ["buy", "sell"] }> {
    constructor(props: { userId: number }) {
        super(props)

        this.handleClearTrade = this.handleClearTrade.bind(this)
        this.handleAmountChange = this.handleAmountChange.bind(this)
        this.handlePairChange = this.handlePairChange.bind(this)
        this.handleSubmitTrade = this.handleSubmitTrade.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
    
        this.state = {
            amount: 0,
            tradingPair: null,
            type: "",
            typeList: ["buy", "sell"]
        }
    }

    async componentDidMount() {
        const tradingPairs = await fetch("http://localhost:3000/pairs").then(res => res.json())
        const tradingPair = tradingPairs.find((pair: TradingPair) => pair.id === 1)

        await this.setState({
            tradingPair
        })
    }

    handleClearTrade() {
        this.setState({ amount: 0 })
    }

    async handleSubmitTrade() {
        if (this.state.tradingPair && this.state.type) {
            const trade: Trade = {
                type: this.state.type,
                price: 3.50,
                quantity: this.state.amount,
                tradingPairId: this.state.tradingPair.id,
                userId: this.props.userId
            }

            return await fetch("http://localhost:3000/trades/trade", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                redirect: "error",
                body: JSON.stringify(trade)
            }).then(res => res.json())
        }
    }

    handleAmountChange(amount: number) {
        this.setState({ amount })
    }

    handlePairChange(tradingPair: TradingPair) {
        this.setState({ tradingPair })
    }

    handleTypeChange(type: string) {
        this.setState({ type })
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
                {
                    this.state && this.state.tradingPair
                    ? <TradingPairSelector onSelectTradingPair={this.handlePairChange}/>
                    : ""
                }
                <Select name="type" title="Type" placeholder="" value={this.state.type} options={this.getTypeOptions()} handleChange={(e: any) => this.handleTypeChange(e.target.value)} />
                <Input name="amount" title="Amount" type="number" handleChange={this.handleAmountChange} placeholder="0" value={this.state.amount}/>
                <Button title="Submit" action={this.handleSubmitTrade}/>
                <Button title="Clear" action={this.handleClearTrade}/> 
            </div>
        )
    }
}
