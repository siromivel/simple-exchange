import React from "react"
import { Prices } from "../types/Prices";

const renderPrices = (prices: any): any => {
    const priceElements = []
    for (const pair in prices) {
        priceElements.push(<div>{pair}: {prices[pair].price.toFixed(8)}</div>)
    }
    return priceElements
}

export const PriceDisplay = (props: { prices: Prices }) =>
        <div className="price-display">
            {renderPrices(props.prices)}
        </div>
