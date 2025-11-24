import * as React from "react"
import BaseIcon, { type IconProps } from "./BaseIcon"

const PlayIcon: React.FC<IconProps> = (props) => (
  <BaseIcon viewBox="0 0 20 24" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </BaseIcon>
)

export default PlayIcon
