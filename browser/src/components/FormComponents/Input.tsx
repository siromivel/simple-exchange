import React from "react"
import { InputProps } from "../../types/InputProps"

const validateMinMaxValue = (value: number | undefined): boolean => {
  return value === value && typeof value === "number"
}

export const Input = (props: InputProps) => (
  <div className="form-input">
    <label htmlFor={props.name}>{props.title}</label>
    {props.type === "number" ? (
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        min={validateMinMaxValue(props.min) ? props.min : -Infinity}
        max={validateMinMaxValue(props.max) ? props.max : Infinity}
        onChange={e => props.handleChange(parseFloat(e.target.value))}
        placeholder={props.placeholder}
      />
    ) : (
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={e => props.handleChange(e.target.value)}
        placeholder={props.placeholder}
      />
    )}
  </div>
)
