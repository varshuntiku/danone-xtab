export default function SelectedQueryIcon({...props}) {
    return <svg width="32" height="32" viewBox="0 0 32 32" style={{stroke: "var(--bg-color)", fill: "none"}} xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="17" fill="currentColor" stroke-width="2"/>
    <path d="M14.5858 17.4138L11.7568 14.5858L10.3428 15.9998L14.5858 20.2428L21.6558 13.1718L20.2428 11.7568L14.5858 17.4138Z" style={{fill: "var(--bg-color)"}} />
    </svg>
  }