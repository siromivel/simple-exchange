import React, { PureComponent, FormEvent } from "react"
import { Select } from "./FormComponents/Select"
import { User } from "../types/User"
import { OptionProps } from "../types/OptionProps"

export class UserSelector extends PureComponent<
  { onSelectUser: Function },
  { user: User | null; userList: [] }
> {
  constructor(props: { onSelectUser: Function }) {
    super(props)

    this.state = {
      user: null,
      userList: [],
    }

    this.updateUser = this.updateUser.bind(this)
  }

  async componentDidMount() {
    const userList = await fetch(`${process.env.REST_API}/users`).then(
      (response: Response) => response.json(),
    )
    await this.setState({ userList })
  }

  getUserOptions(): OptionProps[] {
    return this.state.userList.map(
      (user: User): OptionProps => {
        return {
          title: user.name,
          value: user.id,
        }
      },
    )
  }

  async updateUser(event: any) {
    const user: User = this.state.userList[event.target.value - 1]
    await this.setState({ user })

    const fullUser = await fetch(
      `${process.env.REST_API}/users/${user.id}`,
    ).then(response => response.json())
    await this.props.onSelectUser(fullUser)
  }

  render() {
    return (
      <Select
        name="User"
        title="User"
        placeholder="Select User"
        value={this.state.user ? this.state.user.id : ""}
        options={this.getUserOptions()}
        handleChange={this.updateUser}
      />
    )
  }
}
