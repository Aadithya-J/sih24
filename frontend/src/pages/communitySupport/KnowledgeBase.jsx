// KnowledgeBase.jsx
import React from "react";
import "./KnowledgeBase.css";

function KnowledgeBase() {
  return (
    <div className="knowledge-base">
      <h2>Knowledge Base</h2>
      <div className="knowledge-item">
        <h3>Article Title</h3>
        <p>Summary of the article or FAQ...</p>
      </div>
      {/* Add more knowledge items here */}
    </div>
  );
}

export default KnowledgeBase;
