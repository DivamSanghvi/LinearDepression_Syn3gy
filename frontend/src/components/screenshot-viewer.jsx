import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Info, Download } from "lucide-react"
import { formatTimeFromSeconds } from "./youtube-utils"

export default function ScreenshotViewer({ screenshots, onJumpToTimestamp }) {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null)

  const downloadScreenshot = (screenshot) => {
    const link = document.createElement("a")
    link.href = screenshot.dataUrl
    link.download = `screenshot-${formatTimeFromSeconds(screenshot.time)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (screenshots.length === 0) {
    return null
  }

  return (
    <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Video Screenshots</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {screenshots.map((screenshot, index) => (
          <div key={index} className="relative group rounded-md overflow-hidden">
            <img
              src={screenshot.dataUrl || "/placeholder.svg"}
              alt={`Screenshot at ${formatTimeFromSeconds(screenshot.time)}`}
              className="w-full h-auto object-cover aspect-video"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
              {formatTimeFromSeconds(screenshot.time)}
            </div>
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={() => setSelectedScreenshot(screenshot)}
              >
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={() => onJumpToTimestamp(screenshot.time)}
              >
                Play
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedScreenshot} onOpenChange={(open) => !open && setSelectedScreenshot(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Screenshot at {selectedScreenshot && formatTimeFromSeconds(selectedScreenshot.time)}
            </DialogTitle>
            <DialogDescription>Analysis and details of this moment in the video</DialogDescription>
          </DialogHeader>

          {selectedScreenshot && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedScreenshot.dataUrl || "/placeholder.svg"}
                  alt={`Screenshot at ${formatTimeFromSeconds(selectedScreenshot.time)}`}
                  className="w-full h-auto rounded-md"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Analysis</h4>
                <p>{selectedScreenshot.explanation}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => downloadScreenshot(selectedScreenshot)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    onJumpToTimestamp(selectedScreenshot.time)
                    setSelectedScreenshot(null)
                  }}
                >
                  Play from this point
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

