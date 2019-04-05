import React from "react"
import { Dictionary } from "../types/Dictionary"

const renderPriceForPairs = (Dictionary: Dictionary): JSX.Element[] => {
  const priceElements = []
  for (const pair in Dictionary) {
    priceElements.push(
      <div>
        {pair}:{" "}
        {Dictionary[pair].price ? Dictionary[pair].price.toFixed(8) : ""}
      </div>,
    )
  }
  return priceElements
}

export const PriceDisplay = (props: { Dictionary: Dictionary }) => (
  <div className="price-display">
    <h2>Current Prices:</h2>
    {renderPriceForPairs(props.Dictionary)}
  </div>
)
