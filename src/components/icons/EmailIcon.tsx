import * as React from "react"

type IconProps = React.SVGProps<SVGSVGElement>

const EmailIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <rect x={3} y={5} width={18} height={14} rx={2} ry={2} />
    <polyline points="3 7 12 13 21 7" />
  </svg>
)

export default EmailIcon
