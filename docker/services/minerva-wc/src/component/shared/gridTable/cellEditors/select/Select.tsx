import { HTMLAttributes } from "preact/compat"
import "./select.scss"

export default function Select({value, options, onChange, type, fullWidth, ...props}: {options: Array<any>, fullWidth: boolean} & HTMLAttributes<HTMLSelectElement>) {
    return <select
        {...props}
        type={type}
        className={`MinervaSelect ${fullWidth? "MinervaFullWidth" : ""}`}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}>
            {options.map(el => (
                <option key={el} value={el}>
                        {el}
                </option>
            ))}
        </select>
}