export default function AddQueryIcon({...props}) {
    return <svg width="32" height="32" viewBox="0 0 32 32" style={{stroke: "var(--color)"}} xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="15" fill="none" stroke-width="2"/>
    <rect x="11" y="15.5" width="11" height="2" rx="1"/>
    <rect x="15.5" y="22" width="11" height="2" rx="1" transform="rotate(-90 15.5 22)"/>
    </svg>
  }