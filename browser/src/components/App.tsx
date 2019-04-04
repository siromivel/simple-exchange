import React, { PureComponent } from "react"
import { TradeDisplay } from "./TradeDisplay";
import { PortfolioDisplay } from "./PortfolioDisplay";
import { PriceDisplay } from "./PriceDisplay";
import { UserSelector } from "./UserSelector";
import { User } from "../types/User";

export class App extends PureComponent<{}, { user: User | null }> {
    constructor(props: {}) {
        super(props)
        this.state = { user: null }
    
        this.handleUser = this.handleUser.bind(this)
    }

    async handleUser(user: User) {
        await this.setState({ user })
    }

    render() {
        return (
        <div className="main">
            <UserSelector onSelectUser={this.handleUser} />
            <PriceDisplay />
            {this.state.user 
                ? [<PortfolioDisplay user={this.state.user} />, <TradeDisplay userId={this.state.user.id}/>] 
                : "" }
        </div>
        )
    }
}
