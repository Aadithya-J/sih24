// CommunityFeed.jsx
import React from "react";
import "./CommunityFeed.css";

function CommunityFeed() {
  return (
    <div className="community-feed">
      <h2>Community Feed</h2>
      <div className="feed-item">
        <h3>Update Title</h3>
        <p>Details of the update or discussion go here...</p>
      </div>
      {/* Add more feed items here */}
    </div>
  );
}

export default CommunityFeed;
