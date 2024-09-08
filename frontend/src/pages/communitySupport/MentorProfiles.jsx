// MentorProfiles.jsx
import React from "react";
import "./MentorProfiles.css";

function MentorProfiles() {
  const mentors = [
    { name: "John Doe", expertise: "Software Engineering" },
    { name: "Jane Smith", expertise: "Data Science" },
    // Add more mentor data here
  ];

  return (
    <div className="mentor-profiles">
      <h2>Mentor Profiles</h2>
      <div className="profiles-list">
        {mentors.map((mentor, index) => (
          <div className="profile-card" key={index}>
            <h3>{mentor.name}</h3>
            <p>{mentor.expertise}</p>
            <button>Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorProfiles;
