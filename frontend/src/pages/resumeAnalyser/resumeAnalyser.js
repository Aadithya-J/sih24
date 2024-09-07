import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './resumeAnalyser.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const parseRecommendations = (recommendationsText) => {
  return recommendationsText.split('\n')
    .filter(item => item.trim())
    .map(item => {
      const match = item.match(/^(.*?)\*\*(.*?)\*\*(.*)$/);
      if (match) {
        return {
          title: match[2].trim(),
          content: match[3].replace(/^:\s*/, '').trim()
        };
      }
      return { title: '', content: item.trim() };
    });
};

const ResumeEvaluation = ({ score, recommendations }) => {
  const labels = [
    'Relevance to Job Role',
    'Clarity and Formatting',
    'Work Experience and Projects',
    'Technical and Soft Skills',
    'Education and Certifications',
    'Achievements and Impact',
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
        pointHoverBorderColor: 'rgba(34, 202, 236, 1)'
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
          color: 'rgba(0, 0, 0, 0.1)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };
  return (
    <div className="container">
      <h2>Resume Evaluation</h2>
      <div className="radar-container">
        <Radar data={data} options={options} />
      </div>
      <div className="recommendations-container">
        <h3>Recommendations:</h3>
        <ul className="recommendations-list">
          {parseRecommendations(recommendations).map((recommendation, index) => (
            <li key={index}>
              <strong>{recommendation.title}</strong> {recommendation.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ResumeAnalyser = () => {
  const [resumeScore, setResumeScore] = useState(null);
  const [recommendations, setRecommendations] = useState('');
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
    formData.append('resume', file);
    formData.append('jobRole', jobRole);

    try {
      const response = await axios.post('http://localhost:4000/analyse-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      setResumeScore(response.data.score);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error analyzing resume:', error.response ? error.response.data : error.message);
      alert('An error occurred while analyzing the resume: ' + (error.response ? error.response.data.error : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-analyser-container">
      <h2>Resume Analyser</h2>
      <form onSubmit={handleSubmit} className="resume-form">
        <div className="file-input-wrapper">
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
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
        <ResumeEvaluation score={resumeScore} recommendations={recommendations} />
      )}
    </div>
  );
}

export default ResumeAnalyser;
