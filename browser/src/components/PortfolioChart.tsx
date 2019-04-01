import React, { PureComponent } from "react"

type Holding = {
    symbol: string,
    allocation: number
}

export class PortfolioChart extends PureComponent<{}, { portfolio: Holding[] }> {

    constructor(props: { portfolio: Holding[] }) {
        super(props)

        this.state = {
            portfolio: [
                {
                    symbol: "BTC",
                    allocation: 15
                },
                {
                    symbol: "DOGE",
                    allocation: 67
                },
                {
                    symbol: "XMR",
                    allocation: 13
                },
                {
                    symbol: "LTC",
                    allocation: 5
                }
            ]
        }
    }

    componentDidMount() {
        const canvas = this.refs.canvas as HTMLCanvasElement
        const ctx = canvas.getContext("2d")
        const colors = ["red", "green", "blue", "yellow"]

        if (ctx) {
            let arcPosition = 0

            this.state.portfolio.forEach((asset, idx) => {
                ctx.fillStyle = colors[idx % colors.length]
                ctx.beginPath()
                ctx.moveTo(canvas.width / 2, canvas.height / 2)
                ctx.arc(
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.height / 2,
                    arcPosition,
                    arcPosition + (Math.PI * 2 * (asset.allocation / 100))
                )
                ctx.lineTo(canvas.width / 2, canvas.height / 2)
                ctx.fill()

                arcPosition += Math.PI * 2 * (asset.allocation / 100)
            })
        }
    }

    render() {
        return (
            <div>
                <canvas ref="canvas" width={200} height={200} />
            </div>
        )
    }
}
