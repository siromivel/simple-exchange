import React from "react"
import { InputProps } from "../../types/InputProps";

export const Input = (props: InputProps) =>
    <div className="form-input">
        <label htmlFor={props.name}>{props.title}</label>
        <input
            id={props.name}
            name={props.name}
            type={props.type}
            value={props.value}
            onChange={
                e => props.type === "number"
                    ? props.handleChange(parseFloat(e.target.value))
                    : props.handleChange(e.target.value)
            }
            placeholder={props.placeholder}
        />
    </div>
