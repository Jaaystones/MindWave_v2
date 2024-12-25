// src/App.js
import React from "react";
import StaticModePage from "./pages/StaticModelPage";
import SweepModePage from './pages/SweepModelPage';  
import HomePage from './pages/HomePage';  // Import the HomePage component
import { Routes, Route } from 'react-router-dom';
import "./css/home.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />  {/* Define the homepage route */}
      <Route path="/static" element={<StaticModePage />} />
      <Route path="/sweep" element={<SweepModePage />} />
    </Routes>
  );
}

export default App;
