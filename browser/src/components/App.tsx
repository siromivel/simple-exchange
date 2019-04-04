import React, { PureComponent } from "react"
import { TradeDisplay } from "./TradeDisplay";
import { PortfolioDisplay } from "./PortfolioDisplay";
import { PriceDisplay } from "./PriceDisplay";
import { UserSelector } from "./UserSelector";
import io from "socket.io-client"
import { User } from "../types/User";
import { Prices } from "../types/Prices";

export class App extends PureComponent<{}, { user: User | null, pairMap: Prices | null }> {
    constructor(props: {}) {
        super(props)
        this.state = {
            user: null,
            pairMap: null
        }
    
        this.handleUser = this.handleUser.bind(this)
    }

    componentDidMount() {
        this.openSocket()
    }

    private openSocket() {
        const socket = io("ws://localhost:8080")
        socket.on('price', (pairMap: Prices) => this.setState({ pairMap }))
        socket.on('disconnect', this.openSocket)
    }

    async handleUser(user: User) {
        await this.setState({ user })
    }

    render() {
        return (
        <div className="main">
            <UserSelector onSelectUser={this.handleUser} />
            {this.state.pairMap
                ? <PriceDisplay pairMap={this.state.pairMap} />
                : ""
            }
            {this.state.user && this.state.pairMap
                ? [<PortfolioDisplay user={this.state.user} />, <TradeDisplay userId={this.state.user.id} pairMap={this.state.pairMap}/>] 
                : "" 
            }
        </div>
        )
    }
}
