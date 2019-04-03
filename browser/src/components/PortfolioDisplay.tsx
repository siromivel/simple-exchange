import React, { PureComponent } from "react"
import { PortfolioChart } from "./PortfolioChart";
import { HoldingsList } from "./HoldingsList";
import { Holding } from "../types/Holding";

export class PortfolioDisplay extends PureComponent<{ user: any }, { user: any }> {
    constructor(props: { user: any }) {
        super(props)

        this.state = {
            user: props.user
        }
    }

    componentDidUpdate() {
        this.setState({ user: this.props.user })
    }

    render() {
        return (
            <div>
                { this.state.user.name.split("").pop() === "s" ? this.state.user.name + "'" : this.state.user.name + " '" } Holdings
                <HoldingsList holdings={this.state.user.holdings}/>
            </div>
        )
    }
}
