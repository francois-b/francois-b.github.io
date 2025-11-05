import * as React from "react"

type IconProps = React.SVGProps<SVGSVGElement>

const LinkedInIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M20 2H4a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2Zm-11.62 16H5.69V9.48h2.69V18Zm-1.34-9.61c-.91 0-1.64-.76-1.64-1.69 0-.94.73-1.69 1.66-1.69.93 0 1.64.75 1.66 1.69 0 .93-.73 1.69-1.68 1.69ZM18.31 18h-2.66v-4.5c0-1.07-.38-1.8-1.33-1.8-.73 0-1.16.5-1.35.99-.07.17-.09.39-.09.62V18h-2.66s.04-7.66 0-8.52h2.66v1.21c.35-.54.98-1.3 2.38-1.3 1.74 0 3.05 1.14 3.05 3.6V18Z" />
  </svg>
)

export default LinkedInIcon
