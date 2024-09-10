import React, { useState } from 'react';
import axios from 'axios';
import './resumeComparator.css';

const ResumeComparator = () => {
  const [jd, setJd] = useState('');
  const [resume1, setResume1] = useState(null);
  const [resume2, setResume2] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    const formData = new FormData();
    formData.append('jd', jd);
    if (resume1) formData.append('resume1', resume1);
    if (resume2) formData.append('resume2', resume2);

    try {
      const result = await axios.post('http://localhost:5002/compare_resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponse(result.data);
    } catch (err) {
      setError('An error occurred while processing the resumes.');
    }
  };

  return (
    <div className="app">
      <h1>Resume Comparison</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jd">Job Description:</label>
          <textarea
            id="jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="resume1">Upload Resume 1:</label>
          <input
            type="file"
            id="resume1"
            onChange={(e) => setResume1(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="resume2">Upload Resume 2:</label>
          <input
            type="file"
            id="resume2"
            onChange={(e) => setResume2(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Compare Resumes</button>
      </form>
      {error && <div className="error">{error}</div>}
      {response && (
        <div className="results">
          <h2>Results for Resume 1</h2>
          <pre>{JSON.stringify(response.resume1, null, 2)}</pre>
          <h2>Results for Resume 2</h2>
          <pre>{JSON.stringify(response.resume2, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeComparator;
