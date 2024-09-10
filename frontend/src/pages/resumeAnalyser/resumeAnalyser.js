import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './resumeAnalyser.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Function to parse recommendations
const parseRecommendations = (recommendationsList) => {
  return recommendationsList.map((item, index) => ({
    title: `Recommendation ${index + 1}`,
    content: item,
  }));
};

// Resume Evaluation component to display all the data
const ResumeEvaluation = ({
  score,
  recommendations,
  profileSummary,
  jdMatch,
  detailedExplanation,
  missingKeywords,
}) => {
  const labels = [
    'Technical skills',
    'Experience',
    'Achievements',
    'Education',
    'Soft skills',
    'Projects',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Resume Score',
        data: score,
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 202, 236, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 202, 236, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container">
      <h2>Resume Evaluation</h2>
      <div className="jd-match">
        <h3>Job Description Match: {jdMatch}</h3>
      </div>
      <div className="profile-summary">
        <h3>Profile Summary:</h3>
        <ul>
          {profileSummary.map((summary, index) => (
            <li key={index}>{summary}</li>
          ))}
        </ul>
      </div>
      <div className="radar-container">
        <Radar data={data} options={options} />
      </div>
      <div className="detailed-explanation">
        <h3>Detailed Explanation:</h3>
        <ul>
          {Object.entries(detailedExplanation).map(([key, value], index) => (
            <li key={index}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
      {missingKeywords && missingKeywords.length > 0 && (
        <div className="missing-keywords">
          <h3>Missing Keywords:</h3>
          <ul>
            {missingKeywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="recommendations-container">
        <h3>Recommendations:</h3>
        <ul className="recommendations-list">
          {recommendations.map((recommendation, index) => (
            <li key={index}>
              <strong>{recommendation.title}:</strong> {recommendation.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Main ResumeAnalyser component
const ResumeAnalyser = () => {
  const [resumeScore, setResumeScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [profileSummary, setProfileSummary] = useState([]);
  const [jdMatch, setJdMatch] = useState('');
  const [detailedExplanation, setDetailedExplanation] = useState({});
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
  };

  const handleJobRoleChange = (e) => {
    setJobRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobRole) {
      alert('Please select a file and enter a job role');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file); // Flask expects 'resume' as a file input
    formData.append('job_description', jobRole); // Flask expects 'job_description'

    try {
      const response = await axios.post('http://localhost:5001/evaluate_resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      console.log(data);

      // Extract score values from the JSON response
      const scores = data.Scores || {};
      const scoreArray = [
        scores['Technical skills'] || 0,
        scores['Experience'] || 0,
        scores['Achievements'] || 0,
        scores['Education'] || 0,
        scores['Soft skills'] || 0,
        scores['Projects'] || 0,
      ];

      setResumeScore(scoreArray);
      setRecommendations(parseRecommendations(data.Recommendations || []));
      setProfileSummary(data['Profile Summary'] || []);
      setJdMatch(data['JD Match'] || '');
      setDetailedExplanation(data['Detailed Explanation'] || {});
      setMissingKeywords(data['Missing Keywords'] || []);

    } catch (error) {
      console.error('Error analyzing resume:', error.response ? error.response.data : error.message);
      alert(
        'An error occurred while analyzing the resume: ' +
          (error.response ? error.response.data.error : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-analyser-container">
      <h2>Resume Analyser</h2>
      <form onSubmit={handleSubmit} className="resume-form">
        <div className="file-input-wrapper">
          <label className="file-label">
            <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
            <span className="btn2">Choose File or Drag and drop</span>
          </label>
          {fileName && <span className="file-name">{fileName}</span>}
        </div>
        <input
          type="text"
          placeholder="Enter job role"
          value={jobRole}
          onChange={handleJobRoleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>
      {resumeScore && (
        <ResumeEvaluation
          score={resumeScore}
          recommendations={recommendations}
          profileSummary={profileSummary}
          jdMatch={jdMatch}
          detailedExplanation={detailedExplanation}
          missingKeywords={missingKeywords}
        />
      )}
    </div>
  );
};

export default ResumeAnalyser;
