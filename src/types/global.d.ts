declare module "*.svg" {
  const content: string
  export default content
}

declare module "*.jpg" {
  const content: string
  export default content
}

declare module "*.jpeg" {
  const content: string
  export default content
}

declare module "*.png" {
  const content: string
  export default content
}

declare module "*.mp4" {
  const content: string
  export default content
}

declare module "react-player" {
  import type { ComponentType } from "react"

  export interface ReactPlayerProps {
    url?: string | string[] | MediaStream
    controls?: boolean
    playing?: boolean
    loop?: boolean
    muted?: boolean
    playsinline?: boolean
    width?: string | number
    height?: string | number
    className?: string
    light?: boolean | string
    [key: string]: unknown
  }

  const ReactPlayer: ComponentType<ReactPlayerProps>
  export default ReactPlayer
}
