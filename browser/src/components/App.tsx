import React, { PureComponent } from "react"
import { TradeDisplay } from "./TradeDisplay"
import { PortfolioDisplay } from "./PortfolioDisplay"
import { PriceDisplay } from "./PriceDisplay"
import { UserSelector } from "./UserSelector"
import io from "socket.io-client"
import { User } from "../types/User"
import { Dictionary } from "../types/Dictionary"

export class App extends PureComponent<
  {},
  { user: User | null; pairMap: Dictionary; pairDataLoaded: boolean }
> {
  constructor(props: {}) {
    super(props)
    this.state = {
      user: null,
      pairMap: {},
      pairDataLoaded: false,
    }

    this.handleUser = this.handleUser.bind(this)
  }

  componentDidMount() {
    this.openSocket()
  }

  private openSocket() {
    const socket = io("ws://localhost:8080")
    socket.on("price", (pairMap: Dictionary) =>
      this.setState({ pairMap, pairDataLoaded: true }),
    )
    socket.on("disconnect", this.openSocket)
  }

  async handleUser(user: User) {
    await this.setState({ user })
  }

  render() {
    return (
      <div className="main">
        <UserSelector onSelectUser={this.handleUser} />
        {this.state.pairDataLoaded ? (
          <PriceDisplay Dictionary={this.state.pairMap} />
        ) : (
          ""
        )}
        {this.state.user && this.state.pairDataLoaded
          ? [
              <PortfolioDisplay
                Dictionary={this.state.pairMap}
                user={this.state.user}
              />,
              <TradeDisplay
                user={this.state.user}
                pairMap={this.state.pairMap}
                onTrade={this.handleUser}
              />,
            ]
          : ""}
      </div>
    )
  }
}
