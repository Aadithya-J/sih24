import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import './resumeAnalyser.css';  // Import the CSS file

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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
      },
    },
    responsive: true,
  };

  return (
    <div className="container">
      <h2>Resume Evaluation</h2>
      <div className="radar-container">
        <Radar data={data} options={options} />
      </div>
      <div className="recommendations-container">
        <h3>Recommendations:</h3>
        <p>{recommendations}</p>
      </div>
    </div>
  );
};

const resumeAnalyser = () => {
  const [resumeScore, setResumeScore] = useState([3, 2, 3, 4, 4, 2]);
  const [recommendations, setRecommendations] = useState(
    "This resume demonstrates a strong foundation in technical skills and extracurricular activities, but it could be improved by focusing on quantifiable achievements and tailoring the content to the specific requirements of a Software Engineer role."
  );

  useEffect(() => {
    // Simulate API call and update the state with real data here
  }, []);

  return (
    <div>
      <ResumeEvaluation score={resumeScore} recommendations={recommendations} />
    </div>
  );
};

export default resumeAnalyser;
