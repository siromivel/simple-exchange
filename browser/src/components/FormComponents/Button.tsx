import React, { FormEvent } from "react"
import { ButtonProps } from "../../types/ButtonProps"

export const Button = (props: ButtonProps) => (
  <div className="form-button">
    <button disabled={props.disabled || false} onClick={(e: FormEvent<HTMLButtonElement>) => props.action(e.currentTarget.value)}>
      {props.title}
    </button>
  </div>
)
