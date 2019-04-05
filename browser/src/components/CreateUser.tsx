import React, { PureComponent } from "react"
import { Input } from "./FormComponents/Input"
import { Button } from "./FormComponents/Button"

export class CreateUser extends PureComponent<
  { onCreateUser: Function },
  { username: string }
> {
  constructor(props: { onCreateUser: Function }) {
    super(props)
    this.state = { username: "" }

    this.createUser = this.createUser.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
  }

  async createUser() {
    const newUser = {
        name: this.state.username
    }

    const user = await fetch(`${process.env.REST_API}/users/new`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      redirect: "error",
      body: JSON.stringify(newUser),
    }).then(response => response.json())

    await this.props.onCreateUser(user)
  }

  handleUsernameChange(name: string) {
    this.setState({ username: name })
  }

  render() {
    return (
      <div className="create-user">
        <Input
          name="name"
          title="New User Name:"
          placeholder=""
          type="text"
          value={this.state.username || ""}
          handleChange={this.handleUsernameChange}
        />

        <Button
          title="Create User"
          action={this.createUser}
          disabled={!this.state.username}
        />
      </div>
    )
  }
}
