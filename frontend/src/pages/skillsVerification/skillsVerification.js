import React, { useState } from "react";
import axios from "axios";
import './SkillsVerification.css';

function SkillsVerification() {
  const [topic, setTopic] = useState(""); // State for input topic
  const [courses, setCourses] = useState([]); // State for fetched courses
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error handling

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:5006/api/courses/${topic}`);
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="skills-container">
      <h1 className="skills-title">Explore Courses</h1>

      {/* Input and Search Button */}
      <div className="skills-search">
        <input
          type="text"
          placeholder="Enter a course topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="skills-input"
        />
        <button onClick={handleSearch} className="skills-search-button">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Display Courses */}
      <div className="skills-cards">
        {courses.length > 0 && courses.map((course, index) => (
          <div key={index} className="skills-card">
            <h2 className="skills-card-title">{course[0]}</h2>
            <p>Powere</p>
            <a href={course[1]} className="skills-card-button continue-learning" target="_blank" rel="noopener noreferrer">
              Continue Learning
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsVerification;
