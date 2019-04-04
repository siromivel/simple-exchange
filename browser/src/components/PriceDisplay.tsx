import React from "react"
import { Prices } from "../types/Prices";

const renderPriceForPairs = (pairMap: any): any => {
    const priceElements = []
    for (const pair in pairMap) {
        priceElements.push(<div>{pair}: {pairMap[pair].price.toFixed(8)}</div>)
    }
    return priceElements
}

export const PriceDisplay = (props: { pairMap: Prices }) =>
        <div className="price-display">
            {renderPriceForPairs(props.pairMap)}
        </div>
