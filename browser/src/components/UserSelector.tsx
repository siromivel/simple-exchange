import React, { PureComponent } from "react"
import { User } from "../types/User";

export class UserSelector extends PureComponent<{ onSelectUser: Function }, { userList: User[] , user: User | null }> {
    constructor(props: { onSelectUser: Function }) {
        super(props)

        this.state = {
            userList: [],
            user: null
        }

        this.updateUser = this.updateUser.bind(this)
    }

    async componentDidMount() {
        const userList = await fetch("http://localhost:3000/users").then((response: Response) => response.json())
        await this.setState({ userList })
    }

    async updateUser(event: any) {
        const user: User = this.state.userList[event.target.value - 1]
        await this.setState({ user })

        const fullUser = await fetch(`http://localhost:3000/users/${user.id}`).then(response => response.json())
        await this.props.onSelectUser(fullUser)
    }

    render() {
        return (
            <select className="user-select" onChange={this.updateUser}>
                { !this.state.user ? <option value=''></option> : "" }
                {
                    this.state.userList.map((user: { id: number, name: string }, idx) => <option key={idx} value={user.id}>{user.name}</option>)
                }
            </select>
        )
    }
}
