import { HTMLAttributes } from "preact/compat"
import "./input.scss"

export default function Input({value, onChange, type, fullWidth, ...props}: {fullWidth: boolean} & HTMLAttributes<HTMLInputElement>) {
    return <input
        {...props}
        type={type}
        className={`MinervaInput ${fullWidth? "MinervaFullWidth" : ""}`}
        value={value}
        onChange={(e: any) => onChange(e.target.value)} />
}