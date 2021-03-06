import React, { PureComponent } from "react"
import { Select } from "./FormComponents/Select"
import { User } from "../types/User"
import { OptionProps } from "../types/OptionProps"

export class UserSelector extends PureComponent<
  { onSelectUser: Function, user: User | null },
  { user: User | null; userList: [], userOptions: OptionProps[] }
> {
  constructor(props: { onSelectUser: Function, user: User | null }) {
    super(props)

    this.state = {
      user: this.props.user,
      userList: [],
      userOptions: []
    }

    this.updateUser = this.updateUser.bind(this)
  }

  async componentDidMount() {
    await this.updateUserList()
    await this.updateUserOptions()
  }

  async componentWillReceiveProps() {
    await this.updateUserList().then(() => this.updateUserOptions)
    await this.setState({ user: this.props.user })
  }

  async updateUserList() {
    const userList = await fetch(`${process.env.REST_API}/users`).then(
      (response: Response) => response.json(),
    )
    await this.setState({ userList })
  }

  async updateUserOptions() {
    const userOptions = this.getUserOptions()
    await this.setState({ userOptions })
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

  async updateUser(event: React.FormEvent<HTMLSelectElement>) {
    const user: User = this.state.userList[
      parseInt(event.currentTarget.value) - 1
    ]
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
