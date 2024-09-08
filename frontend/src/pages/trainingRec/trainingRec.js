import React, { useState } from "react";
import axios from "axios";
import "./trainingRec.css";

function TrainingRec() {
  const [topic, setTopic] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:5000/api/resources/${topic}`);
      setResources(response.data);
    } catch (err) {
      setError("Error fetching resources. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="resource-container">
      <h1 className="resource-title">Find Resources</h1>
      <div className="resource-header">
        <input
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="resource-input"
        />
        <button className="resource-button" onClick={handleSubmit}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul className="resource-list">
        {resources.length > 0 &&
          resources.map((resource, index) => (
            <li key={index} className="resource-item">
              <a href={resource[1]} target="_blank" rel="noopener noreferrer">
                {resource[0]}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default TrainingRec; // Export the correct component name