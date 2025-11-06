import * as React from "react"

type IconProps = React.SVGProps<SVGSVGElement>

const PlayIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 20 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {/* Matches the geometry from src/images/newicons/play.svg */}
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

export default PlayIcon
