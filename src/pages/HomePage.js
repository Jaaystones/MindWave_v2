// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the MindWave App</h1>
      <p>Select a mode to get started:</p>
      <div>
        <Link to="/static">
          <button>Static Mode</button>
        </Link>
        <Link to="/sweep">
          <button>Sweep Mode</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
