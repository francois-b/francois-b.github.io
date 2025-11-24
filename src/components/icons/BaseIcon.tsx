import * as React from "react"

export type IconProps = React.SVGProps<SVGSVGElement> & {
  viewBox?: string
  strokeWidth?: number
}

interface BaseIconProps extends IconProps {
  children: React.ReactNode
}

const BaseIcon: React.FC<BaseIconProps> = ({
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  strokeWidth = 2,
  children,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
)

export default BaseIcon
