"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);
  const [interimResult, setInterimResult] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [error, setError] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [dotLottie, setDotLottie] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Web Speech API is not available in this browser");
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const interimTranscript = [];
      const finalTranscript = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript.push(transcript);
        } else {
          interimTranscript.push(transcript);
        }
      }

      setResults((prevResults) => [
        ...prevResults,
        ...finalTranscript.map((transcript) => ({
          transcript,
          timestamp: Date.now(),
        })),
      ]);
      setInterimResult(interimTranscript.join(""));
      setFinalResult(
        (prevFinalResult) => prevFinalResult + finalTranscript.join(" ")
      );
    };

    recognitionRef.current.onerror = (event) => {
      setError(event.error);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const dotLottieRefCallback = (dotLottieInstance) => {
    setDotLottie(dotLottieInstance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeTypes = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"];

      let supportedMimeType = "";
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          supportedMimeType = mimeType;
          break;
        }
      }

      if (!supportedMimeType) {
        setError("No supported audio recording format found");
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: supportedMimeType,
        });

        if (audioBlob.size > 0) {
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          stream.getTracks().forEach((track) => track.stop());
        } else {
          console.error("No audio data recorded");
          setError("No audio data was recorded");
        }
      };

      mediaRecorder.start();
      recognitionRef.current?.start();
      setIsRecording(true);
      if (dotLottie) {
        dotLottie.play();
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Could not access microphone: " + error.message);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setIsRecording(false);
    if (dotLottie) {
      dotLottie.stop();
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    try {
      const options = {
        method: "post",
        url: "http://localhost:5001/viva",
        headers: {
          Accept: "*/*",
          "User-Agent": "Flashpost",
          "Content-Type": "application/json",
        },
        data: { topics: topic },
      };

      const response = await axios.request(options);
      const question = response.data.question;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: question, isUser: false },
      ]);
      setCurrentQuestion(question);
      setIsInputDisabled(true);

      // Speak the question out loud
      speak(question);
    } catch (error) {
      console.error(error);
      setError("Failed to generate question");
    }
  };

  const sendMessage = async () => {
    if (!audioURL || !finalResult) {
      setError("No audio or transcript available");
      return;
    }

    try {
      setIsLoading(true);
      const audioBlob = await fetch(audioURL).then((r) => r.blob());

      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.webm");
      formData.append("user_answer", finalResult);
      formData.append("answer", "This is the final answer"); // Left empty as per your specification
      formData.append("question", currentQuestion);

      // Add user's message to chat
      setMessages((prev) => [...prev, { text: finalResult, isUser: true }]);

      // Send feedback
      const response = await axios.post(
        "http://localhost:5001/viva/feedback",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Optional: Handle response
      if (response.data) {
        const feedback = response.data.feedback || "Feedback received";
        setMessages((prev) => [
          ...prev,
          {
            text: feedback,
            isUser: false,
          },
        ]);

        // Speak the feedback out loud
        speak(feedback);
      }

      // Reset states
      setFinalResult("");
      setResults([]);
      setAudioURL(null);
      setIsInputDisabled(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle text-to-speech
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-100 to-purple-300 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex items-start">
        <div className="w-1/2 flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/197276e4-1363-4fed-8856-b8ed365d2e25/OD78mJPdGx.lottie"
            autoplay={false}
            loop
            dotLottieRefCallback={dotLottieRefCallback}
            className="w-[60vw] h-[500px] opacity-60"
          />
        </div>

        <div className="w-1/2 pl-8">
          <div
            ref={chatContainerRef}
            className="h-[500px] mb-4 space-y-4 pr-8 overflow-y-auto"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg h-auto max-w-[50%] ${
                  message.isUser ? "ml-auto bg-white" : "bg-white"
                } shadow-md break-words`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-purple-500 font-semibold">
                Processing...
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "secondary"}
                size="icon"
                className="rounded-full shadow-md"
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>

              <Input
                value={finalResult + interimResult}
                onChange={(e) => setFinalResult(e.target.value)}
                placeholder="Your transcribed speech will appear here..."
                className="rounded-full bg-white shadow-md border-purple-200 focus:border-purple-300 focus:ring-purple-300"
              />

              <Button
                onClick={sendMessage}
                size="icon"
                className="rounded-full shadow-md bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!audioURL || !finalResult || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic for the viva..."
                className="flex-grow rounded-full bg-white shadow-md border-purple-200 focus:border-purple-300 focus:ring-purple-300"
                disabled={isInputDisabled}
              />

              <Button
                onClick={handleGenerate}
                disabled={isInputDisabled}
                className="rounded-full shadow-md"
              >
                Generate
              </Button>
            </div>

            {audioURL && (
              <audio controls src={audioURL} className="mt-4 w-full">
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
