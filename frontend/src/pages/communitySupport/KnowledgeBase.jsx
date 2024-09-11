import React from "react";
import "./KnowledgeBase.css";

function KnowledgeBase() {
  const knowledgeData = [
    {
      title: "How to Install Node.js",
      description: "This article covers the installation of Node.js on various platforms, including Windows, macOS, and Linux."
    },
    {
      title: "Understanding RESTful APIs",
      description: "Learn about the principles of REST, how to structure endpoints, and the best practices for designing APIs."
    },
    {
      title: "What is Git and How to Use It?",
      description: "A beginner's guide to Git, covering the basics of version control, creating repositories, committing changes, and collaborating with others."
    },
    {
      title: "Introduction to Docker Containers",
      description: "An introduction to containerization with Docker, including setting up a Docker environment and running your first container."
    },
    {
      title: "Debugging JavaScript in Chrome DevTools",
      description: "A detailed guide to debugging JavaScript using Chrome's developer tools, including breakpoints, stepping through code, and inspecting variables."
    },
  ];

  return (
    <div className="knowledge-base">
      <h2>Knowledge Base</h2>
      {knowledgeData.map((item, index) => (
        <div className="knowledge-item" key={index}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default KnowledgeBase;
