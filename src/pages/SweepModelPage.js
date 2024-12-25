import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactSlider from "react-slider";
import "../css/sweep-mode.css";

const SweepModePage = () => {
  const [frequencyRange, setFrequencyRange] = useState([1, 50]); // Frequency range
  const [currentFrequency, setCurrentFrequency] = useState(20); // Current frequency
  const [tone, setTone] = useState(50); // Default tone value
  const [duration, setDuration] = useState(1); // Sweep duration in minutes
  const [interval, setIntervalValue] = useState(100); // Sweep interval in milliseconds
  const [isSweeping, setIsSweeping] = useState(false); // Sweep state
  const audioContextRef = useRef(null); // Reference to AudioContext
  const oscillatorRef = useRef(null); // Reference to Oscillator
  const gainNodeRef = useRef(null); // Reference to GainNode
  const navigate = useNavigate();

  // Initialize AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      audioContextRef.current.close();
    };
  }, []);

  // Dynamic Frequency Sweep
  useEffect(() => {
    if (!isSweeping) return;

    const totalSteps = (duration * 60 * 1000) / interval; // Total steps based on duration and interval
    const stepSize = (frequencyRange[1] - frequencyRange[0]) / totalSteps; // Frequency increment per step

    const sweepInterval = setInterval(() => {
      setCurrentFrequency((prevFrequency) => {
        if (prevFrequency + stepSize >= frequencyRange[1]) {
          // Stop the sweep when max frequency is reached
          stopSweep();
          return frequencyRange[1];
        }
        return prevFrequency + stepSize;
      });
    }, interval);

    return () => clearInterval(sweepInterval);
  }, [isSweeping, frequencyRange, duration, interval]);

  // Start Sweep
  const startSweep = () => {
    if (!audioContextRef.current) return;

    oscillatorRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();

    oscillatorRef.current.type = "sine";
    oscillatorRef.current.frequency.setValueAtTime(currentFrequency, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.setValueAtTime(tone / 100, audioContextRef.current.currentTime);

    oscillatorRef.current.connect(gainNodeRef.current).connect(audioContextRef.current.destination);
    oscillatorRef.current.start();
    setIsSweeping(true);
  };

  // Stop Sweep
  const stopSweep = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    setIsSweeping(false);
  };

  // Update Oscillator Frequency
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(
        currentFrequency,
        audioContextRef.current.currentTime
      );
    }
  }, [currentFrequency]);

  return (
    <div className="sweep-mode-page">
      <h1>Sweep Mode</h1>

      {/* Single Slider for Frequency Range */}
      <div className="slider-container">
        <label>
          Frequency Range: {frequencyRange[0]} Hz - {frequencyRange[1]} Hz
        </label>
        <ReactSlider
          min={1}
          max={50}
          value={frequencyRange}
          onChange={(values) => setFrequencyRange(values)}
          className="slider"
          thumbClassName="thumb"
          trackClassName="track"
          minDistance={1} // Minimum distance between thumbs
          pearling
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
          onChange={(e) => setTone(Number(e.target.value))}
        />
      </div>

      {/* Duration Slider */}
      <div className="slider-container">
        <label htmlFor="duration">Sweep Duration: {duration} minute(s)</label>
        <input
          type="range"
          id="duration"
          min="1"
          max="10"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>

      {/* Interval Slider */}
      <div className="slider-container">
        <label htmlFor="interval">Sweep Interval: {interval} ms</label>
        <input
          type="range"
          id="interval"
          min="1"
          max="1000"
          step="25"
          value={interval}
          onChange={(e) => setIntervalValue(Number(e.target.value))}
        />
      </div>

      {/* Current Frequency Display */}
      <p>Current Frequency: {Math.round(currentFrequency)} Hz</p>

      {/* Start and Stop Sweep Buttons */}
      <div className="control-buttons">
        <button onClick={startSweep} disabled={isSweeping}>
          Start Sweep
        </button>
        <button onClick={stopSweep} disabled={!isSweeping}>
          Stop Sweep
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/static")} className="nav-button">
          Go to Static Mode
        </button>
        <button onClick={() => navigate("/")} className="nav-button">
          Home
        </button>
      </div>
    </div>
  );
};

export default SweepModePage;
