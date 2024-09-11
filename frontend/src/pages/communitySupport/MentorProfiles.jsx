import React from "react";
import "./MentorProfiles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

function MentorProfiles() {
  const mentors = [
    { name: "John Doe", expertise: "Software Engineering", experience: "5 years at Google" },
    { name: "Jane Smith", expertise: "Data Science", experience: "3 years at Facebook" },
    { name: "Alice Johnson", expertise: "Cybersecurity", experience: "4 years at Microsoft" },
    { name: "Bob Brown", expertise: "Machine Learning", experience: "6 years at Amazon" },
    { name: "Charlie Davis", expertise: "Cloud Computing", experience: "7 years at IBM" },
    // Add more mentor data here if needed
  ];

  return (
    <div className="mentor-profiles">
      <h2>Mentor Profiles</h2>
      <div className="profiles-scroll">
        {mentors.map((mentor, index) => (
          <div className="profile-card" key={index}>
            <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
            <div className="profile-info">
              <h3>{mentor.name}</h3>
              <p>{mentor.expertise}</p>
              <p>{mentor.experience}</p>
              <button>Connect</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorProfiles;
