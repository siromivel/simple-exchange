import React from "react"
import { Holding } from "../types/Holding"

export const HoldingsList = (props: { holdings: Holding[] }) =>
    <ul>
        { props.holdings.map((holding: Holding) => <li key={holding.id}>{holding.balance} {holding.asset.symbol}</li>) }
    </ul>
