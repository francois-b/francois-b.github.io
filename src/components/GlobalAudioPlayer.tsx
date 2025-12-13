import React from "react"
import { Link } from "gatsby"
import { useAudio } from "../context/audio-context"

const formatTime = (seconds: number): string => {
  if (!seconds || !isFinite(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const GlobalAudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, currentTime, duration, toggle, seek, close } = useAudio()

  if (!currentTrack) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    seek(percentage * duration)
  }

  return (
    <div className="global-audio-player">
      <div className="global-audio-player__content">
        <button
          className="global-audio-player__play-btn"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="global-audio-player__info">
          <Link to={`/blog/${currentTrack.slug}`} className="global-audio-player__title">
            {currentTrack.title}
          </Link>
          <div className="global-audio-player__progress-row">
            <span className="global-audio-player__time">{formatTime(currentTime)}</span>
            <div
              className="global-audio-player__progress-bar"
              onClick={handleProgressClick}
              role="slider"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={duration}
              tabIndex={0}
            >
              <div
                className="global-audio-player__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="global-audio-player__time">{formatTime(duration)}</span>
          </div>
        </div>

        <button
          className="global-audio-player__close-btn"
          onClick={close}
          aria-label="Close player"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default GlobalAudioPlayer
