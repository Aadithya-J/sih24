import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./UserProfile.css";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem("uid"); // Get UID from localStorage
      try {
        const response = await axios.post(
          "http://localhost:4000/get-user-data",
          { uid }
        );
        const data = response.data;
        console.log("User data:", data);
        // Set default values for missing fields
        setUserData({
          name: data.name || "John Doe",
          profileLogo: data.profileLogo || "https://via.placeholder.com/100",
          email : data.email || "",
          city: data.city || "City",
          college: data.college || "College",
          activeDays: data.activeDays || [1, 1, 0, 1, 0, 1, 1],
          ratingHistory: data.ratingHistory || [10,20,30,40,50],
          atsScore: data.atsScore || 80,
        });
      } catch (error) {
        setError("Error fetching user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Update user data (handled elsewhere)
  };

  const handleEditClick = () => {
    // Show edit form (handled elsewhere)
  };

  const handleDownloadResume = async () => {
    const uid = localStorage.getItem("uid");
    try {
      const response = await axios.get(
        `http://localhost:4000/get-resume-url/${uid}`
      );
      const { downloadURL } = response.data;
      const link = document.createElement("a");
      link.href = downloadURL;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  // Format data for chart.js (Line chart for rating)
  const chartData = {
    labels:
      userData?.ratingHistory.map((_, index) => `Month ${index + 1}`) || [],
    datasets: [
      {
        label: "ATS Score Trend",
        data: userData?.ratingHistory || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart.js options
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
    return (
      userData?.activeDays.map((active, index) => (
        <div
          key={index}
          className="active-day"
          style={{
            backgroundColor: active ? "#4caf50" : "#ddd",
          }}
        ></div>
      )) || null
    );
  };

  if (loading) {
    return <LoadingScreen/>
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img
          src={userData.profileLogo}
          alt={`${userData.name}'s Logo`}
          className="profile-logo"
        />
        <h2>{userData.name}'s Profile</h2>
      </div>

      <div className="about-section">
        <h3>About</h3>
        <p>Email: {userData.email}</p>
        <p>City: {userData.city}</p>
        <p>College: {userData.college}</p>
      </div>
      <div className="resume-section">
        <button onClick={handleDownloadResume}>Download Resume</button>
      </div>

      <div className="edit-about-section">
        {/* Add edit functionality here */}
      </div>

      <div className="ats-score">
        <h3>ATS Score: {userData.atsScore}</h3>
        <p>
          This is the current ATS score based on recent activities and
          performance.
        </p>
      </div>

      <div className="active-days-section">
        <h3>Active Days</h3>
        <div className="active-days">{renderActiveDays()}</div>
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
