"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/auth";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  ChevronLeft,
  ChevronDown,
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Bookmark,
  Calendar,
  Clock3,
  Settings,
  Lightbulb,
  Award,
  Star,
  PanelLeftClose,
  PanelRightClose,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  BackgroundBeams,
  BackgroundGradient,
  BentoGrid,
  BentoGridItem,
  TextGenerateEffect,
  StickyScroll,
  SparklesCore,
  AnimatedTooltip,
  Meteors,
  InfiniteMovingCards,
  HoverBorderGradient,
  LampContainer,
  Lamp,
  Spotlight,
  TracingBeam,
} from "@/components/ui/acaternity";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import QuizModal from "./quiz-modal";

export default function PlaybackApp() {
  const [activeTab, setActiveTab] = useState("transcript");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoSrc, setVideoSrc] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [layoutMode, setLayoutMode] = useState("balanced");
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerIntervalState] = useState(null);
  const [notes, setNotes] = useState([
    "Take notes on key concepts",
    "Remember to review the transcript",
  ]);
  const [newNote, setNewNote] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({ name: "Guest" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      router.push("/");
    } else {
      // Decode JWT or fetch user details from backend
      const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decoding JWT
      console.log(decodedUser);
      setUser(decodedUser);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (timerActive) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
      setTimerIntervalState(interval);
      return () => clearInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerIntervalState(null);
    }
  }, [timerActive, timerInterval]);

  const formatTimerTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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
  `;

  const topics = [
    { title: "Introduction to Machine Learning", timestamp: 10 },
    { title: "Supervised vs Unsupervised Learning", timestamp: 30 },
    { title: "Feature Extraction Techniques", timestamp: 30 },
    { title: "Model Training Fundamentals", timestamp: 40 },
    { title: "Evaluation Metrics", timestamp: 50 },
    { title: "Real-world Applications", timestamp: 60 },
    { title: "Future Trends in AI", timestamp: 70 },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    const seekTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const setPlaybackSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  const jumpToTimestamp = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const downloadTranscript = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcript.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    // Add user message
    setChatMessages([
      ...chatMessages,
      { sender: "user", message: messageInput },
    ]);
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "Based on the video, machine learning is a subset of AI that focuses on algorithms that learn from data.",
        "Supervised learning uses labeled data, while unsupervised learning finds patterns in unlabeled data.",
        "Feature extraction is the process of selecting the most relevant attributes from your dataset.",
        "The evaluation metrics discussed in the video include accuracy, precision, recall, and F1 score.",
        "The video mentions that deep learning is a subset of machine learning that uses neural networks with multiple layers.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setChatMessages([
        ...chatMessages,
        { sender: "user", message: messageInput },
        { sender: "ai", message: randomResponse },
      ]);
      setMessageInput("");
      setIsLoading(false);
    }, 1500);
  };

  const addNote = () => {
    if (newNote.trim() !== "") {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const getLayoutClasses = () => {
    switch (layoutMode) {
      case "video":
        return {
          videoSection: "lg:w-3/4 w-full",
          contentSection: "lg:w-1/4 w-full",
        };
      case "content":
        return {
          videoSection: "lg:w-1/4 w-full",
          contentSection: "lg:w-3/4 w-full",
        };
      default:
        return {
          videoSection: "lg:w-2/5 w-full",
          contentSection: "lg:w-3/5 w-full",
        };
    }
  };

  const layoutClasses = getLayoutClasses();

  const testimonials = [
    {
      quote:
        "Playback has completely transformed how I study. The interactive features make learning engaging and effective.",
      name: "Sarah Johnson",
      title: "Computer Science Student",
    },
    {
      quote:
        "The ability to take notes while watching lectures has improved my retention significantly. Highly recommended!",
      name: "Michael Chen",
      title: "Engineering Major",
    },
    {
      quote:
        "As a professor, I appreciate how Playback helps my students engage with course material more deeply.",
      name: "Dr. Emily Rodriguez",
      title: "Professor of Biology",
    },
    {
      quote:
        "The Q&A feature is like having a tutor available 24/7. It's been invaluable for my studies.",
      name: "James Wilson",
      title: "Physics Student",
    },
  ];

  const features = [
    {
      title: "Interactive Video Learning",
      description:
        "Engage with educational content through our advanced video player with playback controls and timestamped topics.",
      icon: <Play className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "AI-Powered Q&A",
      description:
        "Get instant answers to your questions about the lecture content with our intelligent assistant.",
      icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Comprehensive Transcripts",
      description:
        "Access complete lecture transcripts with downloadable options for offline study and review.",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Topic Navigation",
      description:
        "Jump directly to specific topics within videos using our intelligent content indexing system.",
      icon: <List className="h-6 w-6 text-amber-500" />,
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="relative">
        <BackgroundBeams className="absolute top-0 left-0 h-full w-full z-0" />

        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Menu className="h-6 w-6 lg:hidden" />
              <div className="flex items-center gap-2">
                <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                  Playback
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-sm">
                Discover
              </Button>
              <Button variant="ghost" className="text-sm">
                Library
              </Button>
              <Button variant="ghost" className="text-sm">
                My Courses
              </Button>
              <Button variant="ghost" className="text-sm">
                Community
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] pl-8 rounded-full bg-background"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  3
                </span>
              </Button>

              <div className="flex items-center gap-2">
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label htmlFor="dark-mode" className="text-sm">
                  {darkMode ? "Dark" : "Light"}
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                  />
                  <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <button className="hidden md:block" onClick={handleLogout}>
                  <div className="text-sm font-medium">{user.name} </div>
                  <div className="text-xs text-muted-foreground">LogOut</div>
                </button>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 relative z-10">
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  <TextGenerateEffect words="Introduction to Machine Learning" />
                </h1>
                <p className="text-muted-foreground mt-2">
                  Learn the fundamentals of machine learning algorithms and
                  applications
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <QuizModal />
              </div>
            </div>
          </div>

          {/* Layout Controls */}
          <div className="mb-4 flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">Layout:</span>
            <Button
              variant={layoutMode === "balanced" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayoutMode("balanced")}
              className={
                layoutMode === "balanced"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : ""
              }
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant={layoutMode === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayoutMode("video")}
              className={
                layoutMode === "video"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : ""
              }
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
            <Button
              variant={layoutMode === "content" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayoutMode("content")}
              className={
                layoutMode === "content"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : ""
              }
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section - Video Player */}
            <div
              className={`${layoutClasses.videoSection} transition-all duration-300`}
            >
              <BackgroundGradient className="rounded-xl overflow-hidden">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
                  {!videoSrc ? (
                    <div
                      className={`h-64 md:h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
                        isDragging
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="relative">
                        <SparklesCore
                          id="tsparticles"
                          background="transparent"
                          minSize={0.6}
                          maxSize={1.4}
                          particleDensity={100}
                          className="w-full h-full absolute"
                          particleColor="#8b5cf6"
                        />
                        <div className="relative z-10 flex flex-col items-center">
                          <Upload className="w-12 h-12 text-purple-500 mb-4" />
                          <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                            Drag and drop your video here
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            or
                          </p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Browse Files
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="video/*"
                            className="hidden"
                          />
                        </div>
                      </div>
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
                                {isPlaying ? (
                                  <Pause className="h-5 w-5" />
                                ) : (
                                  <Play className="h-5 w-5" />
                                )}
                              </Button>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={toggleMute}
                                  className="text-white hover:bg-white/20"
                                >
                                  {isMuted ? (
                                    <VolumeX className="h-5 w-5" />
                                  ) : (
                                    <Volume2 className="h-5 w-5" />
                                  )}
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
                                {formatTime(currentTime)} /{" "}
                                {formatTime(duration)}
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
                                      playbackRate === speed
                                        ? "bg-white/20"
                                        : ""
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
              </BackgroundGradient>

              {/* Course Progress */}
              {/* <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Course Progress</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">42% Complete</span>
                </div>
                <Progress value={42} className="h-2 bg-purple-100 dark:bg-purple-950">
                  <div className="h-full bg-purple-600" style={{ width: '42%' }} />
                </Progress>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Course Details</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600">Machine Learning</Badge>
                    <Badge className="bg-purple-500 hover:bg-purple-600">AI</Badge>
                    <Badge className="bg-green-500 hover:bg-green-600">Data Science</Badge>
                  </div>
                </div>
              </div> */}

              {/* Study Timer */}
              <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-purple-500" />
                    Study Timer
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTimer}
                      className={
                        timerActive
                          ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                          : ""
                      }
                    >
                      {timerActive ? "Pause" : "Start"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetTimer}>
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="text-3xl font-mono text-center py-2 font-bold text-purple-600 dark:text-purple-400">
                  {formatTimerTime(timerSeconds)}
                </div>
              </div>

              {/* Sticky Notes */}
              <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-amber-500" />
                    Quick Notes
                  </h3>
                </div>
                <div className="space-y-2 mb-4">
                  {notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md relative group"
                    >
                      <p className="text-sm">{note}</p>
                      <button
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteNote(index)}
                      >
                        <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addNote();
                      }
                    }}
                  />
                  <Button onClick={addNote} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Section - Tabs */}
            <div
              className={`${layoutClasses.contentSection} transition-all duration-300`}
            >
              <div className="bg-white  dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
                <Tabs
                  defaultValue="transcript"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <div className="border-b m-4 dark:border-gray-700">
                    <TabsList className="w-full  justify-start flex rounded-none bg-transparent border-b dark:border-gray-700">
                      <TabsTrigger
                        value="transcript"
                        className="data-[state=active]:border-b-2 px-8 flex  data-[state=active]:border-purple-500 rounded-none data-[state=active]:shadow-none"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Transcript
                      </TabsTrigger>
                      <TabsTrigger
                        value="qa"
                        className="data-[state=active]:border-b-2  flex px-8 data-[state=active]:border-purple-500 rounded-none data-[state=active]:shadow-none"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Q&A
                      </TabsTrigger>
                      <TabsTrigger
                        value="topics"
                        className="data-[state=active]:border-b-2  flex  mx-16 data-[state=active]:border-purple-500 rounded-none data-[state=active]:shadow-none"
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
                          className="flex items-center gap-1 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/30"
                        >
                          <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          Download PDF
                        </Button>
                      </div>
                      <ScrollArea className="h-[440px] p-4">
                        <div className="prose dark:prose-invert max-w-none">
                          {transcript.split("\n").map((line, index) => {
                            if (line.startsWith("# ")) {
                              return (
                                <h1
                                  key={index}
                                  className="text-2xl font-bold text-purple-800 dark:text-purple-300"
                                >
                                  {line.replace("# ", "")}
                                </h1>
                              );
                            } else if (line.startsWith("## ")) {
                              return (
                                <h2
                                  key={index}
                                  className="text-xl font-semibold text-purple-700 dark:text-purple-400"
                                >
                                  {line.replace("## ", "")}
                                </h2>
                              );
                            } else if (line.startsWith("### ")) {
                              return (
                                <h3
                                  key={index}
                                  className="text-lg font-medium text-purple-600 dark:text-purple-500"
                                >
                                  {line.replace("### ", "")}
                                </h3>
                              );
                            } else if (line.startsWith("- ")) {
                              return (
                                <ul
                                  key={index}
                                  className="list-disc list-inside"
                                >
                                  <li
                                    dangerouslySetInnerHTML={{
                                      __html: line
                                        .replace("- ", "")
                                        .replace(
                                          /\*\*(.*?)\*\*/g,
                                          "<strong>$1</strong>"
                                        ),
                                    }}
                                  />
                                </ul>
                              );
                            } else if (line.match(/^\d+\. /)) {
                              return (
                                <ol
                                  key={index}
                                  className="list-decimal list-inside"
                                >
                                  <li
                                    dangerouslySetInnerHTML={{
                                      __html: line
                                        .replace(/^\d+\. /, "")
                                        .replace(
                                          /\*\*(.*?)\*\*/g,
                                          "<strong>$1</strong>"
                                        ),
                                    }}
                                  />
                                </ol>
                              );
                            } else if (
                              line.startsWith("**") &&
                              line.endsWith("**")
                            ) {
                              return (
                                <p key={index} className="font-bold">
                                  {line.replace(/\*\*/g, "")}
                                </p>
                              );
                            } else if (line.trim() === "") {
                              return <br key={index} />;
                            } else {
                              return (
                                <p
                                  key={index}
                                  dangerouslySetInnerHTML={{
                                    __html: line.replace(
                                      /\*\*(.*?)\*\*/g,
                                      "<strong>$1</strong>"
                                    ),
                                  }}
                                />
                              );
                            }
                          })}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="qa"
                      className="m-0 h-full flex flex-col"
                    >
                      {/* Header */}
                      <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="font-semibold">
                          Ask Questions About the Lecture
                        </h2>
                      </div>

                      {/* Messages Area */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {chatMessages.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${
                                msg.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                  msg.sender === "user"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                }`}
                              >
                                {msg.message}
                              </div>
                            </div>
                          ))}

                          {/* AI is Thinking Indicator */}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-slate-800 flex items-center gap-2">
                                <RotateCcw className="h-4 w-4 animate-spin" />
                                <span>AI is thinking...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      {/* Input Box */}
                      <div className="p-4 border-t dark:border-gray-700">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ask a question about the lecture..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800"
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={isLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="topics" className="m-0 h-full">
                      {/* Header */}
                      <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="font-semibold">
                          Key Topics & Timestamps
                        </h2>
                      </div>

                      {/* Topics List */}
                      <ScrollArea className="h-[440px]">
                        <div className="divide-y w-full dark:divide-gray-700">
                          {topics.map((topic, index) => (
                            <HoverBorderGradient
                              key={index}
                              className="p-4 bg-white dark:bg-slate-900 cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                              onClick={() => jumpToTimestamp(topic.timestamp)}
                              containerClassName="rounded-none"
                              as="div"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center w-full gap-3">
                                  <Clock className="h-5 w-5 text-purple-500" />
                                  <span className="text-black dark:text-gray-100">
                                    {topic.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="border-purple-200 text-black dark:text-gray-100 dark:border-purple-800"
                                  >
                                    {formatTime(topic.timestamp)}
                                  </Badge>
                                  <ChevronRight className="h-4 w-4 text-purple-500" />
                                </div>
                              </div>
                            </HoverBorderGradient>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Related Courses */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden p-8">
                  <BackgroundGradient className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Deep Learning Fundamentals
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Neural networks, backpropagation, and more
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </BackgroundGradient>
                </Card>

                <Card className="overflow-hidden p-8">
                  <BackgroundGradient className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-md bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Natural Language Processing
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Text analysis, sentiment, and transformers
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </BackgroundGradient>
                </Card>
              </div>
            </div>
          </div>

          {/* Additional Widgets Section */}
          <div className="mt-16 ">
            {/* <LampContainer>
              <div className="h-[400px]">
                <h2 className="text-3xl font-bold text-center mb-8">
                  Enhance Your Learning Experience
                </h2>
              </div>
            </LampContainer> */}

            {/* <TracingBeam className="px-6">
              <div className="max-w-2xl mx-auto my-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Playback?</h2>
                <div className="space-y-8">
                  <p>
                    Playback is designed to transform how you learn from video content. Our platform combines cutting-edge 
                    technology with thoughtful learning design to create an experience that helps you retain information better.
                  </p>
                  <p>
                    With features like interactive transcripts, AI-powered Q&A, and topic navigation, you can engage with 
                    educational content in ways that traditional video platforms don't allow.
                  </p>
                  <p>
                    Whether you're a student, professional, or lifelong learner, Playback gives you the tools to make the most 
                    of your educational videos.
                  </p>
                </div>
              </div>
            </TracingBeam> */}

            {/* Feature Grid */}
            {/* <div className="my-16">
              <h2 className="text-2xl font-bold mb-8 text-center">Powerful Learning Features</h2>
              <BentoGrid className="max-w-6xl mx-auto">
                {features.map((feature, i) => (
                  <BentoGridItem
                    key={i}
                    title={feature.title}
                    description={feature.description}
                    header={
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8">
                        {feature.icon}
                      </div>
                    }
                    className="border border-purple-100 dark:border-purple-800"
                  />
                ))}
              </BentoGrid>
            </div> */}

            {/* Testimonials */}
            {/* <div className="my-16 relative overflow-hidden py-10">
              <Spotlight
                className="-top-40 left-0"
                fill="purple"
              />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-8 text-center">What Our Users Say</h2>
                <div className="max-w-5xl mx-auto">
                  <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                    pauseOnHover={true}
                  />
                </div>
              </div>
            </div> */}

            {/* Stats Widget */}
            <div className="my-16 ">
              <div className="max-w-5xl mx-auto   bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 w-full">
                  <h2 className="text-xl font-bold mb-6 text-center">
                    Learning Analytics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex w-fullflex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        87%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                        Average Completion Rate
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        12.5
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                        Hours Watched This Month
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        24
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                        Courses In Progress
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="my-16">
              <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">
                    Upcoming Learning Schedule
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const isToday = i === 2;
                      const hasEvent = [1, 3, 5].includes(i);
                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-lg border ${
                            isToday
                              ? "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {
                                [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ][i]
                              }
                            </div>
                            <div
                              className={`text-lg font-semibold ${
                                isToday
                                  ? "text-purple-600 dark:text-purple-400"
                                  : ""
                              }`}
                            >
                              {i + 10}
                            </div>
                          </div>
                          {hasEvent && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                              {i === 1 && "Data Science - 2PM"}
                              {i === 3 && "ML Workshop - 10AM"}
                              {i === 5 && "AI Ethics - 4PM"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Study Group Widget */}
            <div className="my-16">
              <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Study Groups</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <Avatar
                              key={i}
                              className="border-2 border-white dark:border-slate-900"
                            >
                              <AvatarImage
                                src={`/placeholder.svg?height=32&width=32&text=${i}`}
                              />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Machine Learning Basics
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            8 members
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Weekly discussions on fundamental ML concepts and
                        algorithms.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Join Group
                      </Button>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex -space-x-2">
                          {[4, 5, 6].map((i) => (
                            <Avatar
                              key={i}
                              className="border-2 border-white dark:border-slate-900"
                            >
                              <AvatarImage
                                src={`/placeholder.svg?height=32&width=32&text=${i}`}
                              />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div>
                          <h3 className="font-medium">Data Science Projects</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            12 members
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Collaborative work on real-world data science
                        challenges.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Join Group
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flashcards Widget */}
            <div className="my-16 relative">
              <Meteors number={20} />
              <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden relative z-10">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Study Flashcards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg h-40 flex items-center justify-center text-center">
                      <div>
                        <h3 className="font-medium mb-2">
                          What is supervised learning?
                        </h3>
                        <Button variant="outline" size="sm" className="mt-2">
                          Reveal Answer
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg h-40 flex items-center justify-center text-center">
                      <div>
                        <h3 className="font-medium mb-2">
                          Name three types of neural networks
                        </h3>
                        <Button variant="outline" size="sm" className="mt-2">
                          Reveal Answer
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg h-40 flex items-center justify-center text-center">
                      <div>
                        <h3 className="font-medium mb-2">
                          What is the purpose of regularization?
                        </h3>
                        <Button variant="outline" size="sm" className="mt-2">
                          Reveal Answer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Fixed Quiz Button */}
        <div className="fixed bottom-6 right-6 z-20">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg rounded-full px-6">
            Take Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

function Share(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

function X(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
