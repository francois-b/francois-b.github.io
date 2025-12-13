import React, { useState, useEffect } from "react"
import { useAudio } from "../context/audio-context"

/**
 * Audio player trigger for blog posts
 * Activates the global persistent audio player
 */
const AudioPlayer = ({ slug, title }) => {
  const [hasAudio, setHasAudio] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { currentTrack, isPlaying, play, pause } = useAudio()

  const audioSrc = `/audio/${slug}.mp3`
  const isCurrentTrack = currentTrack?.slug === slug
  const isThisPlaying = isCurrentTrack && isPlaying

  useEffect(() => {
    // Check if audio file exists
    fetch(audioSrc, { method: 'HEAD' })
      .then(response => {
        setHasAudio(response.ok)
        setIsLoading(false)
      })
      .catch(() => {
        setHasAudio(false)
        setIsLoading(false)
      })
  }, [audioSrc])

  if (isLoading || !hasAudio) {
    return null
  }

  const handleClick = () => {
    if (isThisPlaying) {
      pause()
    } else {
      play({ slug, title, src: audioSrc })
    }
  }

  return (
    <div className="audio-player">
      <button
        className="audio-player__button"
        onClick={handleClick}
        aria-label={isThisPlaying ? "Pause" : "Listen to this article"}
      >
        <span className="audio-player__icon">
          {isThisPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
        <span className="audio-player__label">
          {isThisPlaying ? "Pause" : "Listen to this article"}
        </span>
      </button>
      {isCurrentTrack && !isPlaying && (
        <span className="audio-player__status">Paused</span>
      )}
    </div>
  )
}

export default AudioPlayer
