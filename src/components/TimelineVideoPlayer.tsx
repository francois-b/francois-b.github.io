import * as React from "react"
import PlayIcon from "./icons/PlayIcon"

export type TimelineVideoPlayerProps = {
  src: string
  className?: string
  ariaLabel?: string
}

const TimelineVideoPlayer: React.FC<TimelineVideoPlayerProps> = ({
  src,
  className,
  ariaLabel = "Project timeline preview video",
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)
  const [playbackProgress, setPlaybackProgress] = React.useState(0)
  const [bufferProgress, setBufferProgress] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  const updatePlaybackProgress = React.useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) {
      setPlaybackProgress(0)
      return
    }

    const nextProgress = (video.currentTime / video.duration) * 100
    setPlaybackProgress(Math.min(Math.max(nextProgress, 0), 100))
  }, [])

  const updateBufferProgress = React.useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) {
      setBufferProgress(0)
      return
    }

    const { buffered, duration } = video
    if (buffered.length === 0) {
      setBufferProgress(0)
      return
    }

    const bufferedEnd = buffered.end(buffered.length - 1)
    const nextProgress = (bufferedEnd / duration) * 100
    setBufferProgress(Math.min(Math.max(nextProgress, 0), 100))
  }, [])

  const handleVideoToggle = React.useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    updateBufferProgress()

    if (video.paused || video.ended) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsVideoPlaying(false)
        })
      }
    } else {
      video.pause()
    }
  }, [updateBufferProgress])

  const handleProgressSeek = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      const clickPosition = event.clientX - rect.left
      const ratio = clickPosition / rect.width
      video.currentTime = Math.max(
        Math.min(video.duration * ratio, video.duration),
        0
      )
      updatePlaybackProgress()
      updateBufferProgress()
    },
    [updateBufferProgress, updatePlaybackProgress]
  )

  const handleProgressKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const video = videoRef.current
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        return
      }

      let target = video.currentTime
      const seekStep = Math.max(video.duration * 0.05, 5)

      switch (event.key) {
        case "ArrowLeft":
        case "Left":
          target = Math.max(video.currentTime - seekStep, 0)
          break
        case "ArrowRight":
        case "Right":
          target = Math.min(video.currentTime + seekStep, video.duration)
          break
        case "Home":
          target = 0
          break
        case "End":
          target = video.duration
          break
        default:
          return
      }

      event.preventDefault()
      video.currentTime = target
      updatePlaybackProgress()
      updateBufferProgress()
    },
    [updateBufferProgress, updatePlaybackProgress]
  )

  return (
    <div
      className={`timeline-player${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={`timeline-player__toggle ${
          isVideoPlaying ? "timeline-player__toggle--active" : ""
        }`}
        onClick={handleVideoToggle}
        aria-label={
          isVideoPlaying ? "Pause timeline video" : "Play timeline video"
        }
        aria-pressed={isVideoPlaying}
      >
        {isVideoPlaying ? (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
          </svg>
        ) : (
          <PlayIcon width={20} height={20} />
        )}
      </button>
      <video
        ref={videoRef}
        className="timeline-player__embed"
        src={src}
        preload="metadata"
        playsInline
        onLoadedMetadata={() => {
          updatePlaybackProgress()
          updateBufferProgress()
        }}
        onLoadedData={updateBufferProgress}
        onPlay={() => {
          setIsVideoPlaying(true)
          updatePlaybackProgress()
        }}
        onPause={() => {
          setIsVideoPlaying(false)
          updatePlaybackProgress()
        }}
        onEnded={() => {
          setIsVideoPlaying(false)
          setPlaybackProgress(100)
          updateBufferProgress()
        }}
        onTimeUpdate={updatePlaybackProgress}
        onProgress={updateBufferProgress}
        onSeeked={updatePlaybackProgress}
      >
        Your browser does not support the video tag.
      </video>
      <div
        className="timeline-player__progress"
        role="slider"
        tabIndex={0}
        aria-label="Video progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(playbackProgress)}
        onClick={handleProgressSeek}
        onKeyDown={handleProgressKeyDown}
      >
        <div
          className="timeline-player__progress-buffer"
          style={{ width: `${bufferProgress}%` }}
        />
        <div
          className="timeline-player__progress-played"
          style={{ width: `${playbackProgress}%` }}
        />
      </div>
    </div>
  )
}

export default TimelineVideoPlayer
