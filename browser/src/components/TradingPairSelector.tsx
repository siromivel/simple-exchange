import React, { PureComponent } from "react";
import { Select } from "./FormComponents/Select";
import { TradingPair } from "../types/TradingPair";
import { OptionProps } from "../types/OptionProps";

export class TradingPairSelector extends PureComponent<{ onSelectTradingPair: Function, pairMap: any, activePair: string }> {
    constructor(props: { onSelectTradingPair: Function, pairMap: any, activePair: string }) {
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
            options.push({
                title: `${this.props.pairMap[pairName].pair.baseAsset.symbol}:${this.props.pairMap[pairName].pair.toAsset.symbol}`,
                value: pairName
            })
        }
        return options
    }

    async updateTradingPair(event: any) {
        await this.props.onSelectTradingPair(event.target.value)
    }

    render() {
        return (
            <Select name="pair" title="Trading Pair" options={this.getTradingPairOptions()} handleChange={this.updateTradingPair} placeholder="Select Pair" value={this.props.activePair}/>
        )
    }
}
