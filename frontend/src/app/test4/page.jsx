"use client"
import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      setError('');
      setProgress(0);
      
      const response = await axios.post('http://localhost:5000/transcribe', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        }
      });

      setTranscript(response.data.segments);
    } catch (err) {
      setError(err.response?.data?.error || 'Transcription failed');
    }
  };

  return (
    <div className="container">
      <h1>Fast Video Transcriber</h1>
      
      <div className="upload-box">
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload} disabled={!file}>
          Transcribe Video
        </button>
        
        {progress > 0 && (
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }}>{progress}%</div>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {transcript && (
        <div className="results">
          <h2>Transcript</h2>
          <div className="transcript-list">
            {transcript.map((segment, index) => (
              <div key={index} className="segment">
                <span className="timestamp">
                  [{formatTime(segment.start)} - {formatTime(segment.end)}]
                </span>
                {segment.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [hours, mins, secs]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
}