// SmartATS.js
import React, { useState } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import './resumeAnalyser2.css'
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SmartATS = () => {
  const [category, setCategory] = useState('Select');
  const [jobDescription, setJobDescription] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);

    try {
      let response;
      if (category === 'ATS Analysis') {
        formData.append('resume', file1);
        response = await axios.post('http://localhost:4000/analyse/', formData);
      } else if (category === 'Compare') {
        formData.append('resume1', file1);
        formData.append('resume2', file2);
        response = await axios.post('http://localhost:4000/analyse/compare', formData);
      }
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const renderSpiderWebChart = (scores) => {
    const data = {
      labels: ['Technical skills', 'Experience', 'Achievements', 'Education', 'Soft skills', 'Projects'],
      datasets: [
        {
          label: 'Scores',
          data: Object.values(scores),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        r: {
          angleLines: {
            display: false
          },
          suggestedMin: 0,
          suggestedMax: 5
        }
      }
    };

    return <Radar data={data} options={options} />;
  };

  const renderResults = () => {
    if (!result) return null;

    if (category === 'ATS Analysis') {
      return (
        <div className="results">
          <h2>ATS Score: {result['JD Match']}</h2>
          {renderSpiderWebChart(result.Scores)}
          <h3>Missing Keywords</h3>
          <ul>
            {result['Missing Keywords'].map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
          <h3>Profile Summary</h3>
          <ul>
            {result['Profile Summary'].map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <h3>Recommendations</h3>
          <ul>
            {result.Recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
          <h3>Detailed Explanation</h3>
          <p>{result['Detailed Explanation']}</p>
        </div>
      );
    } else if (category === 'Compare') {
      return (
        <div className="results">
          <div className="comparison">
            <div className="resume1">
              <h2>Resume 1 ATS Score: {result.resume1['JD Match']}</h2>
              {renderSpiderWebChart(result.resume1.Scores)}
              <h3>Missing Keywords</h3>
              <ul>
                {result.resume1['Missing Keywords'].map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
              <h3>Profile Summary</h3>
              <ul>
                {result.resume1['Profile Summary'].map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <h3>Recommendations</h3>
              <ul>
                {result.resume1.Recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className="resume2">
              <h2>Resume 2 ATS Score: {result.resume2['JD Match']}</h2>
              {renderSpiderWebChart(result.resume2.Scores)}
              <h3>Missing Keywords</h3>
              <ul>
                {result.resume2['Missing Keywords'].map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
              <h3>Profile Summary</h3>
              <ul>
                {result.resume2['Profile Summary'].map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <h3>Recommendations</h3>
              <ul>
                {result.resume2.Recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="comparison-conclusion">
            <h3>Conclusion</h3>
            {parseFloat(result.resume1['JD Match']) > parseFloat(result.resume2['JD Match']) ? (
              <p>Resume 1 is better suited for this job based on the ATS analysis.</p>
            ) : parseFloat(result.resume2['JD Match']) > parseFloat(result.resume1['JD Match']) ? (
              <p>Resume 2 is better suited for this job based on the ATS analysis.</p>
            ) : (
              <p>Both resumes are equally matched for this job based on the ATS analysis.</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="smart-ats">
      <h1>Smart ATS with Spider Web Graph</h1>
      <p>Improve Your Resume ATS Compatibility and Visualize Your Strengths</p>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Select">Select</option>
        <option value="ATS Analysis">ATS Analysis</option>
        <option value="Compare">Compare</option>
      </select>

      {category !== 'Select' && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description"
          />
          <input
            type="file"
            onChange={(e) => setFile1(e.target.files[0])}
            accept=".pdf"
          />
          {category === 'Compare' && (
            <input
              type="file"
              onChange={(e) => setFile2(e.target.files[0])}
              accept=".pdf"
            />
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      )}

      {renderResults()}
    </div>
  );
};

export default SmartATS;