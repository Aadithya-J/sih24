import React, { useState } from "react";
import axios from "axios";
import "./trainingRec.css";
import { FaGoogle } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

function TrainingRec() {
  const [topic, setTopic] = useState("");
  const [resources, setResources] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Make two API calls: one for Google resources, one for YouTube playlists
      const [resourceResponse, playlistResponse] = await Promise.all([
        axios.get(`http://localhost:5004/api/resources/${topic}`),
        axios.get(`http://localhost:5003/api/videos/${topic}`)
      ]);
      
      setResources(resourceResponse.data);  // Set Google resources
      setPlaylists(playlistResponse.data);  // Set YouTube playlists
    } catch (err) {
      setError("Error fetching data. Please try again.");
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

      <div className="resource-cards">
        {resources.length > 0 && (
          <div>
            <h2><FaGoogle /> Resources</h2>
            {resources.map((resource, index) => (
              <div key={index} className="resource-card">
                <h3 className="resource-card-title">{resource[0]}</h3>
                <a
                  href={resource[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card-link"
                >
                  View Resource
                </a>
              </div>
            ))}
          </div>
        )}

        {playlists.length > 0 && (
          <div>
            <h2><FaYoutube /> Playlists</h2>
            {playlists.map((playlist, index) => (
              <div key={index} className="resource-card">
                <h3 className="resource-card-title">{playlist[1]}</h3>
                <p>Channel: {playlist[2]}</p>
                <a
                  href={playlist[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card-link"
                >
                  View Playlist
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainingRec;
