// Utility functions for YouTube video handling

/**
 * Extract YouTube video ID from a URL
 * @param {string} url YouTube URL in various formats
 * @returns {string | null} YouTube video ID or null if invalid
 */
export function extractYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Convert YouTube URL to embed URL
 * @param {string} url YouTube URL
 * @returns {string | null} Embed URL or null if invalid
 */
export function getYoutubeEmbedUrl(url) {
  const videoId = extractYoutubeId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

/**
 * Get YouTube thumbnail URL
 * @param {string} videoId YouTube video ID
 * @param {"default" | "hq" | "mq" | "sd" | "maxres"} [quality="hq"] Thumbnail quality
 * @returns {string} Thumbnail URL
 */
export function getYoutubeThumbnail(videoId, quality = "hq") {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}

/**
 * Format seconds to MM:SS or HH:MM:SS format
 * @param {number} seconds Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTimeFromSeconds(seconds) {
  if (isNaN(seconds)) return "00:00"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

/**
 * Generate timestamps at regular intervals
 * @param {number} duration Video duration in seconds
 * @param {number} [interval=30] Interval between timestamps in seconds
 * @returns {Array<{ time: number; title: string }>} Array of timestamp objects
 */
export function generateTimestamps(duration, interval = 30) {
  const timestamps = []

  for (let time = 0; time < duration; time += interval) {
    timestamps.push({
      time,
      title: `Timestamp at ${formatTimeFromSeconds(time)}`,
    })
  }

  return timestamps
}

/**
 * Generate mock explanations for timestamps
 * @param {Array<{ time: number; title: string }>} timestamps Array of timestamp objects
 * @returns {Record<number, string>} Object mapping timestamps to explanations
 */
export function generateMockExplanations(timestamps) {
  const explanations = {}

  timestamps.forEach((timestamp) => {
    explanations[timestamp.time] =
      `At ${formatTimeFromSeconds(timestamp.time)}, the video discusses important concepts related to this section. This is a key moment in the presentation that highlights core principles.`
  })

  return explanations
}

/**
 * Take a screenshot from a YouTube video
 * Note: This is a mock function as direct screenshot capture from YouTube videos
 * is restricted by their terms of service. In a real application, you would need
 * to use YouTube's API or a server-side solution.
 *
 * @param {string} videoId YouTube video ID
 * @param {number} time Time in seconds
 * @returns {Promise<string>} Promise resolving to a data URL of the screenshot
 */
export async function takeYoutubeScreenshot(videoId, time) {
  // In a real implementation, this would use a server-side API
  // For now, we'll return the thumbnail as a fallback
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = getYoutubeThumbnail(videoId)

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)

      // Add timestamp overlay
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, img.height - 30, img.width, 30)

        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.fillText(formatTimeFromSeconds(time), img.width / 2, img.height - 10)
      }

      resolve(canvas.toDataURL("image/png"))
    }

    img.onerror = () => {
      // Fallback to a placeholder if thumbnail loading fails
      resolve(`/placeholder.svg?height=720&width=1280&text=Screenshot at ${formatTimeFromSeconds(time)}`)
    }
  })
}

