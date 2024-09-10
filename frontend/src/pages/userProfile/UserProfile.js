import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // For displaying the rating chart
import 'chart.js/auto'; // Necessary for chart.js in React
import './UserProfile.css';
import axios from 'axios';

const UserProfile = () => {
  // Sample data to simulate fetching from an API
  const [userData, setUserData] = useState({
    name: 'John Doe',
    profileLogo: 'https://via.placeholder.com/100', // Placeholder logo URL
    about: 'This is a sample user profile.', // Sample about text
    activeDays: [1, 1, 0, 1, 0, 0, 1, 1, 1, 1], // 1 for active, 0 for inactive days
    ratingHistory: [450, 470, 460, 480, 490, 510], // Sample ATS score changes over time
    atsScore: 510,
  });

  // Local state for form input and edit mode
  const [aboutInput, setAboutInput] = useState(userData.about);
  const [isEditing, setIsEditing] = useState(false);

  // Simulated API fetch (could be replaced with real API call)
  useEffect(() => {
    // Example of simulating an API call
    setTimeout(() => {
      setUserData({
        name: 'Jane Doe',
        profileLogo: 'https://via.placeholder.com/100', // Update with real logo URL
        about: 'Enthusiastic professional with a passion for technology and innovation.',
        activeDays: [1, 0, 1, 0, 1, 1, 1, 1, 0, 0],
        ratingHistory: [400, 420, 430, 460, 480, 500],
        atsScore: 500,
      });
    }, 1000); // Simulate 1-second delay
  }, []);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUserData((prevState) => ({
      ...prevState,
      about: aboutInput,
    }));
    setIsEditing(false); // Hide the edit form after updating
  };

  // Show edit form
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDownloadResume = async () => {
    let uid = localStorage.getItem('uid');
    try {
        const response = await axios.get(`http://localhost:4000/get-resume-url/${uid}`);
        const { downloadURL } = response.data;
        console.log(downloadURL);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading resume:', error);
    }
};

  // Format data for chart.js (Line chart for rating)
  const chartData = {
    labels: userData.ratingHistory.map((_, index) => `Month ${index + 1}`), // Dynamic labels
    datasets: [
      {
        label: 'ATS Score Trend',
        data: userData.ratingHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart.js options (you can customize further)
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Score: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  // Render GitHub-like contribution streaks (active days)
  const renderActiveDays = () => {
    return userData.activeDays.map((active, index) => (
      <div
        key={index}
        className="active-day"
        style={{
          backgroundColor: active ? '#4caf50' : '#ddd',
        }}
      ></div>
    ));
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={userData.profileLogo} alt={`${userData.name}'s Logo`} className="profile-logo" />
        <h2>{userData.name}'s Profile</h2>
      </div>

      <div className="about-section">
        <h3>About</h3>
        <p>{userData.about}</p>
      </div>

      <div className="edit-about-section">
        {isEditing ? (
          <>
            <h3>Edit About Information</h3>
            <form onSubmit={handleFormSubmit}>
              <textarea
                value={aboutInput}
                onChange={(e) => setAboutInput(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Write something about yourself..."
                required
              />
              <button type="submit">Update</button>
            </form>
          </>
        ) : (
          <button onClick={handleEditClick}>Edit About</button>
        )}
      </div>

      <div className="ats-score">
        <h3>ATS Score: {userData.atsScore}</h3>
        <p>This is the current ATS score based on recent activities and performance.</p>
      </div>
      <div className="resume-section">
        <button onClick={handleDownloadResume}>Download Resume</button>
      </div>

      <div className="active-days-section">
        <h3>Active Days </h3>
        <div className="active-days">
          {renderActiveDays()}
        </div>
        <p>Green represents active days.</p>
      </div>

      <div className="chart-section">
        <h3>ATS Score Trend</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default UserProfile;
