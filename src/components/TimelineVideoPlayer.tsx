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
  const [progress, setProgress] = React.useState({ playback: 0, buffer: 0 })
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  const clampProgress = (value: number) => Math.min(Math.max(value, 0), 100)

  const isVideoReady = (video: HTMLVideoElement | null) =>
    video && video.duration && !Number.isNaN(video.duration)

  const updatePlaybackProgress = React.useCallback(() => {
    const video = videoRef.current
    if (!isVideoReady(video)) {
      setProgress(prev => ({ ...prev, playback: 0 }))
      return
    }

    const nextProgress = (video.currentTime / video.duration) * 100
    setProgress(prev => ({ ...prev, playback: clampProgress(nextProgress) }))
  }, [])

  const updateBufferProgress = React.useCallback(() => {
    const video = videoRef.current
    if (!isVideoReady(video)) {
      setProgress(prev => ({ ...prev, buffer: 0 }))
      return
    }

    const { buffered, duration } = video
    if (buffered.length === 0) {
      setProgress(prev => ({ ...prev, buffer: 0 }))
      return
    }

    const bufferedEnd = buffered.end(buffered.length - 1)
    const nextProgress = (bufferedEnd / duration) * 100
    setProgress(prev => ({ ...prev, buffer: clampProgress(nextProgress) }))
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

  const updateProgress = React.useCallback(() => {
    updatePlaybackProgress()
    updateBufferProgress()
  }, [updatePlaybackProgress, updateBufferProgress])

  const handleProgressSeek = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current
      if (!isVideoReady(video)) return

      const rect = event.currentTarget.getBoundingClientRect()
      const ratio = (event.clientX - rect.left) / rect.width
      video.currentTime = Math.max(Math.min(video.duration * ratio, video.duration), 0)
      updateProgress()
    },
    [updateProgress]
  )

  const handleProgressKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const video = videoRef.current
      if (!isVideoReady(video)) return

      const seekStep = Math.max(video.duration * 0.05, 5)
      const seekActions: Record<string, number> = {
        ArrowLeft: Math.max(video.currentTime - seekStep, 0),
        Left: Math.max(video.currentTime - seekStep, 0),
        ArrowRight: Math.min(video.currentTime + seekStep, video.duration),
        Right: Math.min(video.currentTime + seekStep, video.duration),
        Home: 0,
        End: video.duration,
      }

      const target = seekActions[event.key]
      if (target === undefined) return

      event.preventDefault()
      video.currentTime = target
      updateProgress()
    },
    [updateProgress]
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
        onLoadedMetadata={updateProgress}
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
          setProgress(prev => ({ ...prev, playback: 100 }))
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
        aria-valuenow={Math.round(progress.playback)}
        onClick={handleProgressSeek}
        onKeyDown={handleProgressKeyDown}
      >
        <div
          className="timeline-player__progress-buffer"
          style={{ width: `${progress.buffer}%` }}
        />
        <div
          className="timeline-player__progress-played"
          style={{ width: `${progress.playback}%` }}
        />
      </div>
    </div>
  )
}

export default TimelineVideoPlayer
