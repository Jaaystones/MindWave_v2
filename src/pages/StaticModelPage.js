import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/style.css";

const StaticModePage = () => {
  const [frequency, setFrequency] = useState(50); // Default frequency
  const [tone, setTone] = useState(20); // Default tone value
  const [isPlaying, setIsPlaying] = useState(false); // Control sound playback
  const audioContextRef = useRef(null); // Reference for AudioContext
  const oscillatorRef = useRef(null); // Reference for the oscillator
  const gainNodeRef = useRef(null); // Reference for the GainNode

  const navigate = useNavigate(); // Navigation hook

  // Initialize AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      audioContextRef.current.close();
    };
  }, []);

  // Start Sound
  const startSound = () => {
    if (!audioContextRef.current || isPlaying) return;

    oscillatorRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();

    oscillatorRef.current.type = "sine"; // Sine wave for smooth sound
    oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.setValueAtTime(tone / 100, audioContextRef.current.currentTime); // Adjust volume

    oscillatorRef.current.connect(gainNodeRef.current).connect(audioContextRef.current.destination);
    oscillatorRef.current.start();
    setIsPlaying(true);
  };

  // Stop Sound
  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  // Update Frequency in Real Time
  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency);
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(
        newFrequency,
        audioContextRef.current.currentTime
      );
    }
  };

  // Update Tone (Volume) in Real Time
  const handleToneChange = (newTone) => {
    setTone(newTone);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        newTone / 100,
        audioContextRef.current.currentTime
      );
    }
  };

  return (
    <div className="static-mode-page">
      <h1>Static Mode</h1>

      {/* Frequency Slider */}
      <div className="slider-container">
        <label htmlFor="frequency">Frequency: {frequency} Hz</label>
        <input
          type="range"
          id="frequency"
          min="1"
          max="50"
          value={frequency}
          onChange={(e) => handleFrequencyChange(Number(e.target.value))}
        />
      </div>

      {/* Tone Slider */}
      <div className="slider-container">
        <label htmlFor="tone">Tone: {tone}</label>
        <input
          type="range"
          id="tone"
          min="20"
          max="1500"
          value={tone}
          onChange={(e) => handleToneChange(Number(e.target.value))}
        />
      </div>

      {/* Start and Stop Sound Buttons */}
      <div className="control-buttons">
        <button onClick={startSound} disabled={isPlaying}>
          Start Sound
        </button>
        <button onClick={stopSound} disabled={!isPlaying}>
          Stop Sound
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/sweep")} className="nav-button">
          Go to Sweep Mode
        </button>
        <button onClick={() => navigate("/")} className="nav-button">
          Home
        </button>
      </div>
    </div>
  );
};

export default StaticModePage;
