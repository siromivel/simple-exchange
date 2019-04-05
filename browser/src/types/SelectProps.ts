import { OptionProps } from "./OptionProps"

export type SelectProps = {
  name: string
  title: string
  value: number | string
  placeholder: string
  options: OptionProps[]
  handleChange: Function
}
