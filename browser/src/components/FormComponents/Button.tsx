import React from "react"
import { ButtonProps } from "../../types/ButtonProps";

export const Button = (props: ButtonProps) =>
    <div className="form-button">
        <button onClick={e => props.action(e)}>{props.title}</button>
    </div>