import React, { useState } from 'react';
import './generateRoadmap.css';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import "@fontsource/balsamiq-sans";

async function getRoadmap(title) {
  const response = await fetch(`http://localhost:4000/roadmap/${title}`);
  const data = await response.json();
  return data;
}

function RoadmapContent() {
  const [title, setTitle] = useState('');
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState(null);

  const fetchRoadmap = async () => {
    if (title.trim()) {
      try {
        const data = await getRoadmap(title);
        setRoadmapData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch roadmap data. Please try again.");
      }
    } else {
      setError("Please enter a title");
    }
  };

  return (
    <div className="roadmap-container">
      <h1 className="roadmap-title">YOUR ROADMAP</h1>
      <div className="roadmap-header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter roadmap title"
          className="roadmap-input"
        />
        <button 
          onClick={fetchRoadmap}
          className="roadmap-button"
        >
          Generate Roadmap
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {roadmapData && (
        <div className="roadmap-content">
          <div className="roadmap-title-section">
            <h2>{roadmapData.title}</h2>
          </div>
          <div className="roadmap-sections">
            {roadmapData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="roadmap-section">
                <div className="roadmap-step-number">
                  Step {sectionIndex + 1}
                </div>
                <h3>{section.name}</h3>
                <ul className="roadmap-subsections">
                  {section.subsections.map((subsection, subIndex) => (
                    <li key={subIndex} className="roadmap-subsection">
                      <div className="roadmap-subsection-number">
                        {sectionIndex + 1}.{subIndex + 1}
                      </div>
                      {subsection.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Roadmap() {
  return (
    <ReactFlowProvider>
      <RoadmapContent />
    </ReactFlowProvider>
  );
}

export default Roadmap;
