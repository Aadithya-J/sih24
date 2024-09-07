import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to Yatharth</h1>
        <p>
          Congratulations! You signed in. Start your journey to bridge dreams to reality with AI-powered tools and community support.
        </p>
        <button className="cta-button">Explore More</button>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature-box">
          <h3>AI-Powered Learning</h3>
          <p>Get personalized feedback and improvement suggestions based on AI-powered resume scoring.</p>
        </div>
        <div className="feature-box">
          <h3>Government Schemes</h3>
          <p>Find government-backed opportunities and schemes to support your career path.</p>
        </div>
        <div className="feature-box">
          <h3>Community Support</h3>
          <p>Connect with peers and mentors, exchange knowledge, and grow together.</p>
        </div>
        <div className="feature-box">
          <h3>Interactive Tools</h3>
          <p>Explore a variety of tools designed to improve your skills and job readiness.</p>
        </div>
      

      {/* Resume Analyzer and Roadmap Section */}
     
        <div className="feature-box">
        <Link to="/resume-analyser">
          <h3>Resume Analyzer</h3>
          <p>Analyze your resume and receive AI-based feedback for improvement.</p>
          
            
          </Link>
        </div>

        <div className="feature-box">
        <Link to="/roadmap">
          <h3>Roadmap</h3>
          <p>Explore a roadmap designed to guide your career development path.</p>
          
            
          </Link>
        </div>
        </div>
    </div>
  );
}

export default Home;
