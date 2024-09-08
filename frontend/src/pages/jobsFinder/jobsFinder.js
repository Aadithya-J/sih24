import React, { useState } from 'react';
import axios from 'axios';
import './JobsFinder.css';

const JobsFinder = () => {
  const [jobRole, setJobRole] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!jobRole || !location) {
      setError('Please enter both job role and location.');
      return;
    }

    setLoading(true);
    setError(null);
    setJobs([]); // Clear previous results

    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${encodeURIComponent(jobRole)}/${encodeURIComponent(location)}`);
      if (response.data.length > 0) {
        setJobs(response.data);
      } else {
        setError('No jobs found for the given role and location.');
      }
    } catch (err) {
      setError('Failed to fetch jobs. Please check your API connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobs-finder-container">
      <h1 className="title">Job Finder</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter job role"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="jobs-container">
        {jobs.map((job, index) => (
          <div key={index} className="job-card">
            <h3>{job[0]}</h3>
            <p><strong>Company:</strong> {job[1]}</p>
            <p><strong>Location:</strong> {job[2]}</p>
            <p><strong>Experience:</strong> {job[3]} years</p>
            <a href={job[4]} target="_blank" rel="noopener noreferrer" className="job-link">
              View Job
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsFinder;
