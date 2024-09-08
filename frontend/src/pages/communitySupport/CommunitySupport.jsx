// CommunitySupport.jsx
import React from "react";
import HeaderSection from "./HeaderSection";
import CommunityFeed from "./CommunityFeed";
import MentorProfiles from "./MentorProfiles";
import PeerConnections from "./PeerConnections";
import KnowledgeBase from "./KnowledgeBase";
import "./CommunitySupport.css";

function CommunitySupport() {
  return (
    <div className="community-support">
      <HeaderSection />
      <CommunityFeed />
      <MentorProfiles />
      <PeerConnections />
      <KnowledgeBase />
    </div>
  );
}

export default CommunitySupport;
