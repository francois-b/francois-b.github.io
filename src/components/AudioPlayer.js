import React, { useState, useEffect } from "react"

/**
 * Audio player for blog post narration
 * Only renders if the audio file exists
 */
const AudioPlayer = ({ slug }) => {
  const [hasAudio, setHasAudio] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const audioSrc = `/audio/${slug}.mp3`

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

  return (
    <div className="audio-player">
      <div className="audio-player__label">
        <span className="audio-player__icon">🎧</span>
        Listen to this article
      </div>
      <audio controls preload="metadata" className="audio-player__element">
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default AudioPlayer
