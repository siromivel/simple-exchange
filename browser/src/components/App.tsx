import React, { PureComponent } from "react"
import { TradeDisplay } from "./TradeDisplay"
import { PortfolioDisplay } from "./PortfolioDisplay"
import { PriceDisplay } from "./PriceDisplay"
import { UserSelector } from "./UserSelector"
import io from "socket.io-client"
import { User } from "../types/User"
import { Dictionary } from "../types/Dictionary"
import { CreateUser } from "./CreateUser"

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

    this.handleUserChange = this.handleUserChange.bind(this)
  }

  componentDidMount() {
    this.openSocket()
  }

  private openSocket() {
    const socket = io(`${process.env.WS_SERVER}`)
    socket.on("price", (pairMap: Dictionary) =>
      this.setState({ pairMap, pairDataLoaded: true }),
    )
    socket.on("disconnect", this.openSocket)
  }

  async handleUserChange(user: User) {
    await this.setState({ user })
  }

  render() {
    return (
      <div className="main">
        <UserSelector user={this.state.user} onSelectUser={this.handleUserChange} />
        {!this.state.user ? (
          <CreateUser onCreateUser={this.handleUserChange} />
        ) : (
          ""
        )}
        {this.state.pairDataLoaded ? (
          <PriceDisplay Dictionary={this.state.pairMap} />
        ) : (
          ""
        )}
        {this.state.user && this.state.pairDataLoaded
          ? [
              <PortfolioDisplay
                pairMap={this.state.pairMap}
                user={this.state.user}
              />,
              <TradeDisplay
                user={this.state.user}
                pairMap={this.state.pairMap}
                onTrade={this.handleUserChange}
              />,
            ]
          : ""}
      </div>
    )
  }
}
