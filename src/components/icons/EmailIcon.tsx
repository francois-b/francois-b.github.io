import * as React from "react"
import BaseIcon, { type IconProps } from "./BaseIcon"

const EmailIcon: React.FC<IconProps> = (props) => (
  <BaseIcon strokeWidth={1.8} {...props}>
    <rect x={3} y={5} width={18} height={14} rx={2} ry={2} />
    <polyline points="3 7 12 13 21 7" />
  </BaseIcon>
)

export default EmailIcon
