import React, { PureComponent } from "react"
import { TradeDisplay } from "./TradeDisplay";
import { PortfolioDisplay } from "./PortfolioDisplay";
import { PriceDisplay } from "./PriceDisplay";
import { UserSelector } from "./UserSelector";
import io from "socket.io-client"
import { User } from "../types/User";
import { Prices } from "../types/Prices";

export class App extends PureComponent<{}, { user: User | null, prices: Prices | null }> {
    constructor(props: {}) {
        super(props)
        this.state = {
            user: null,
            prices: null
        }
    
        this.handleUser = this.handleUser.bind(this)
    }

    componentDidMount() {
        this.openSocket()
    }

    private openSocket() {
        const socket = io("ws://localhost:8080")
        socket.on('price', (prices: Prices) => this.setState({ prices }))
        socket.on('disconnect', this.openSocket)
    }

    async handleUser(user: User) {
        await this.setState({ user })
    }

    render() {
        return (
        <div className="main">
            <UserSelector onSelectUser={this.handleUser} />
            {this.state.prices
                ? <PriceDisplay prices={this.state.prices} />
                : ""
            }
            {this.state.user && this.state.prices
                ? [<PortfolioDisplay user={this.state.user} />, <TradeDisplay userId={this.state.user.id} pairs={this.state.prices}/>] 
                : "" 
            }
        </div>
        )
    }
}
