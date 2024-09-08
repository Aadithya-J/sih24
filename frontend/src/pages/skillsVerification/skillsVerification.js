import React from "react";
import './SkillsVerification.css'; // Ensure the CSS file is correctly named and located

function SkillsVerification() {
  const dummyCourses = [
    {
      title: "Introduction to Python",
      description: "Learn the basics of Python programming and build the fundamentals needed to crack trending programming jobs.",
      link: "#",
    },
    {
      title: "Bussiness Analytics",
      description: "Deep dive into how bussiness analytics transforms data into insights to improve business decisions.",
      link: "#",
    },
    {
      title: "Web Development Bootcamp",
      description: "Comprehensive guide to modern web development.",
      link: "#",
    },
    {
      title: "Data Science with R",
      description: "Learn data science techniques using R programming.",
      link: "#",
    },
  ];

  return (
    <div className="skills-container">
      <h1 className="skills-title">Explore Courses</h1>
      <div className="skills-cards">
        {dummyCourses.map((course, index) => (
          <div key={index} className="skills-card">
            <h2 className="skills-card-title">{course.title}</h2>
            <p className="skills-card-description">{course.description}</p>
            <div className="skills-card-buttons">
              <a href={course.link} className="skills-card-button continue-learning">
                Continue Learning
              </a>
              <a href={course.link} className="skills-card-button get-certified">
                Get Certified
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsVerification;
