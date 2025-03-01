"use client"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Upload,
  Download,
  Send,
  Clock,
  BookOpen,
  MessageSquare,
  List,
  ChevronRight,
  RotateCcw,
} from "lucide-react"

export default function VideoLearningApp() {
  const [activeTab, setActiveTab] = useState("transcript")
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [videoSrc, setVideoSrc] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  const transcript = `
# Introduction to Machine Learning

## Basic Concepts

Machine learning is a subset of artificial intelligence that focuses on developing systems that learn from data. 
Unlike traditional programming, where explicit instructions are provided, machine learning algorithms build models based on sample data to make predictions or decisions.

### Key Components:

1. **Data Collection**: Gathering relevant information
2. **Feature Extraction**: Identifying important attributes
3. **Model Training**: Teaching the algorithm patterns
4. **Evaluation**: Testing the model's performance
5. **Deployment**: Implementing the model in real-world scenarios

## Types of Machine Learning

- **Supervised Learning**: Training with labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Reinforcement Learning**: Learning through trial and error
  `

  const topics = [
    { title: "Introduction to Machine Learning", timestamp: 45 },
    { title: "Supervised vs Unsupervised Learning", timestamp: 180 },
    { title: "Feature Extraction Techniques", timestamp: 320 },
    { title: "Model Training Fundamentals", timestamp: 450 },
    { title: "Evaluation Metrics", timestamp: 590 },
    { title: "Real-world Applications", timestamp: 720 },
    { title: "Future Trends in AI", timestamp: 850 },
  ]

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value) => {
    const seekTime = value[0]
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const setPlaybackSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
      setPlaybackRate(speed)
    }
  }

  const jumpToTimestamp = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
      setCurrentTime(seconds)
      if (!isPlaying) {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const downloadTranscript = () => {
    const element = document.createElement("a")
    const file = new Blob([transcript], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "transcript.md"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const sendMessage = () => {
    if (messageInput.trim() === "") return

    // Add user message
    setChatMessages([...chatMessages, { sender: "user", message: messageInput }])
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "Based on the video, machine learning is a subset of AI that focuses on algorithms that learn from data.",
        "Supervised learning uses labeled data, while unsupervised learning finds patterns in unlabeled data.",
        "Feature extraction is the process of selecting the most relevant attributes from your dataset.",
        "The evaluation metrics discussed in the video include accuracy, precision, recall, and F1 score.",
        "The video mentions that deep learning is a subset of machine learning that uses neural networks with multiple layers.",
      ]

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      setChatMessages([
        ...chatMessages,
        { sender: "user", message: messageInput },
        { sender: "ai", message: randomResponse },
      ])
      setMessageInput("")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        {/* Left Section - Video Player (40%) */}
        <div className="lg:w-2/5 w-full">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            {!videoSrc ? (
              <div
                className={`h-64 md:h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">Drag and drop your video here</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">or</p>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-primary hover:bg-primary/90">
                  Browse Files
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full aspect-video bg-black"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                />

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex flex-col gap-2">
                    {/* Progress Bar */}
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </Button>
                          <Slider
                            value={[volume]}
                            min={0}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                            className="w-20"
                          />
                        </div>

                        <span className="text-white text-xs">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex bg-black/30 rounded-md">
                          {[0.5, 1, 1.5, 2].map((speed) => (
                            <Button
                              key={speed}
                              variant="ghost"
                              size="sm"
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`text-white text-xs px-2 h-7 hover:bg-white/20 ${
                                playbackRate === speed ? "bg-white/20" : ""
                              }`}
                            >
                              {speed}x
                            </Button>
                          ))}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleFullscreen}
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course Progress */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Course Progress</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">42% Complete</span>
            </div>
            <Progress value={42} className="h-2" />

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Course Details</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500 hover:bg-blue-600">Machine Learning</Badge>
                <Badge className="bg-purple-500 hover:bg-purple-600">AI</Badge>
                <Badge className="bg-green-500 hover:bg-green-600">Data Science</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Tabs (60%) */}
        <div className="lg:w-3/5 w-full">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            <Tabs defaultValue="transcript" value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b dark:border-gray-700">
                <TabsList className="w-full justify-start rounded-none bg-transparent border-b dark:border-gray-700">
                  <TabsTrigger
                    value="transcript"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger
                    value="qa"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Q&A
                  </TabsTrigger>
                  <TabsTrigger
                    value="topics"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                  >
                    <List className="w-4 h-4 mr-2" />
                    Find Topics
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="h-[500px]">
                <TabsContent value="transcript" className="m-0 h-full">
                  <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="font-semibold">Lecture Transcript</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadTranscript}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                  <ScrollArea className="h-[440px] p-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{transcript}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="qa" className="m-0 h-full flex flex-col">
                  <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="font-semibold">Ask Questions About the Lecture</h2>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center gap-2">
                            <div className="animate-spin">
                              <RotateCcw className="h-4 w-4" />
                            </div>
                            <span>AI is thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t dark:border-gray-700">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question about the lecture..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                      />
                      <Button onClick={sendMessage} disabled={isLoading}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="topics" className="m-0 h-full">
                  <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="font-semibold">Key Topics & Timestamps</h2>
                  </div>
                  <ScrollArea className="h-[440px]">
                    <div className="divide-y dark:divide-gray-700">
                      {topics.map((topic, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-between"
                          onClick={() => jumpToTimestamp(topic.timestamp)}
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <span>{topic.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{formatTime(topic.timestamp)}</Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Related Courses */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Deep Learning Fundamentals</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Neural networks, backpropagation, and more
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Natural Language Processing</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Text analysis, sentiment, and transformers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Quiz Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-full px-6">Take Quiz</Button>
      </div>
    </div>
  )
}

