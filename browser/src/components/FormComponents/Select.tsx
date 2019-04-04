import React from "react"
import { SelectProps } from "../../types/SelectProps";
import { OptionProps } from "../../types/OptionProps";

export const Select = (props: SelectProps) =>
    <div className="form-select">
        <label>{props.title}</label>
        <select name={props.name} value={props.value} onChange={(e) => props.handleChange(e)}>
            {!props.value ? <option value="" disabled>{props.placeholder}</option> : ""}
            {
                props.options.map((option: OptionProps, idx) =>
                    <option
                        key={idx}
                        value={option.value}
                        >{option.title}
                    </option>
                )
            }
        </select>
    </div>
