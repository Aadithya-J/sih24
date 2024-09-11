import React from "react";
import "./CommunityFeed.css";

function CommunityFeed() {
  return (
    <div className="community-page">
      <header className="community-header">
        <h1>Welcome to the Community Feed</h1>
        <p>Stay updated with the latest discussions, updates, and posts from the community.</p>
      </header>
      
      <div className="community-feed">
        <h2>Latest Updates</h2>

        <div className="feed-item">
          <h3>New Feature Release: Dark Mode</h3>
          <p>We’ve just released the highly anticipated dark mode feature! Now you can switch to dark mode for a more comfortable browsing experience during the night.</p>
        </div>

        <div className="feed-item">
          <h3>Upcoming Community Event</h3>
          <p>Join us for the virtual meetup this Friday! We'll discuss the future of the platform and gather feedback from our users. RSVP now to secure your spot.</p>
        </div>

        <div className="feed-item">
          <h3>Security Update: Password Reset Improvements</h3>
          <p>Our latest security patch includes improvements to the password reset process. We’ve made it easier and more secure to recover your account if you forget your password.</p>
        </div>

        <div className="feed-item">
          <h3>New Blog Post: The Future of AI</h3>
          <p>Check out our latest blog post where we explore the possibilities and challenges in the evolving world of Artificial Intelligence. Don’t miss out on this insightful read!</p>
        </div>
      </div>
    </div>
  );
}

export default CommunityFeed;
