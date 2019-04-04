import React, { PureComponent } from "react";
import { Select } from "./FormComponents/Select";
import { TradingPair } from "../types/TradingPair";
import { OptionProps } from "../types/OptionProps";

export class TradingPairSelector extends PureComponent<{ onSelectTradingPair: Function }, { tradingPairId: number, tradingPairList: []  }> {
    constructor(props: { onSelectTradingPair: Function }) {
        super(props)

        this.state = {
            tradingPairId: 1,
            tradingPairList: []
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
        return this.state.tradingPairList.map((pair: TradingPair): OptionProps => {
            return {
                title: `${pair.baseAsset.symbol}:${pair.toAsset.symbol}`,
                value: pair.id
            }
        })
    }

    async updateTradingPair(event: any) {
        const tradingPairId: number = parseInt(event.target.value)
        await this.setState({ tradingPairId })
        await this.props.onSelectTradingPair(tradingPairId)
    }

    render() {
        return (
            <Select name="pair" title="Trading Pair" options={this.getTradingPairOptions()} handleChange={this.updateTradingPair} placeholder="Select Pair" value={this.state.tradingPairId}/>
        )
    }
}
