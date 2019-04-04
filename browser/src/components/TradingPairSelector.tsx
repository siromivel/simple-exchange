import React, { PureComponent } from "react";
import { TradingPair } from "../types/TradingPair";
import { OptionProps } from "../types/OptionProps";
import { Select } from "./FormComponents/Select";

export class TradingPairSelector extends PureComponent<{ onSelectTradingPair: Function }, { tradingPair: TradingPair | null, tradingPairList: []  }> {
    constructor(props: { onSelectTradingPair: Function }) {
        super(props)

        this.state = {
            tradingPair: null,
            tradingPairList: []
        }

        this.updateTradingPair = this.updateTradingPair.bind(this)
    }

    async componentDidMount() {
        const tradingPairList = await fetch("http://localhost:3000/pairs").then((response: Response) => response.json())
        await this.setState({ tradingPairList })
    }

    getTradingPairOptions(): OptionProps[] {
        return this.state.tradingPairList.map((pair: TradingPair): OptionProps => {
            return {
                title: `${pair.baseAsset.symbol}:${pair.toAsset.symbol}`,
                value: pair.id
            }
        })
    }

    async updateTradingPair(event: any) {
        const tradingPair: TradingPair = this.state.tradingPairList[event.target.value]
        await this.setState({ tradingPair })
        await this.props.onSelectTradingPair(tradingPair)
    }

    render() {
        return (
            <Select name="pair" title="Trading Pair" options={this.getTradingPairOptions()} handleChange={this.updateTradingPair} placeholder="Select Pair" value={this.state.tradingPair ? this.state.tradingPair.id : NaN}/>
        )
    }
}
