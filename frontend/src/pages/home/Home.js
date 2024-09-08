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
          Start your journey to bridge dreams to reality with AI-powered tools and community support.
        </p>
        <button className="cta-button">Explore More</button>
      </div>

      {/* About the Web App Card */}
      <div className="about-card">
        <h2>About Yatharth</h2>
        <p>
          Yatharth is designed to empower you on your career journey. Our platform offers a suite of AI-driven tools and community support to help you navigate your career development, enhance your resume, and connect with like-minded individuals. Explore our features to discover how we can assist you in achieving your professional goals.
        </p>
        <Link to="/about" className="learn-more-link">Learn More</Link>
      </div>
      {/* Personalized Experience Card */}
      <div className="feature-box">
        <Link to="/personalized-form">
          <h3>Get a Personalized Experience</h3>
          <p>Click here to enter your details and connect with peers and mentors.</p>
        </Link>
      </div>

      {/* Features Section */}
<div className="features-section">
<div className="feature-box">
  <a href="https://www.myscheme.gov.in/find-scheme" target="_blank" rel="noopener noreferrer">
    <h3>Government Schemes</h3>
    <img src="government-schemes-logo.png" alt="Government Schemes" className="feature-logo" />
    <p>Find government-backed opportunities and schemes to support your career path.</p>
  </a>
</div>

  
  <div className="feature-box">
    <Link to="/roadmap">
      
      <h3>Roadmap</h3>
      <img src="roadmap-logo.jpeg" alt="Roadmap" className="feature-logo" />
      <p>Explore a roadmap designed to guide your career development path.</p>
    </Link>
  </div>
  
  <div className="feature-box">
   
    <h3>Virtual Events</h3>
    <img src="virtual-events-logo.jpeg" alt="Virtual Events" className="feature-logo" />
    <p>Join virtual events, workshops, and webinars on career development, including sessions for people with special needs.</p>
  </div>
  
  <div className="feature-box">
    
    <h3>Real-Time Job Market Insights</h3>
    <img src="market-insights-logo.jpeg" alt="Real-Time Job Market Insights" className="feature-logo" />
    <p>Stay ahead with our real-time job market dashboard—track trends, skills in demand, and salary benchmarks, all powered by data analytics.</p>
  </div>
  
  <div className="feature-box">
   
    <h3>Skills Verification and Certification</h3>
    <img src="skills-verification-logo.png" alt="Skills Verification and Certification" className="feature-logo" />
    <p>Verify and certify your skills with our assessments. Earn badges and certifications to showcase on your profile and LinkedIn!</p>
  </div>
  
  <div className="feature-box">
    <Link to="/jobsfinder">
      
      <h3>Jobs Finder</h3>
      <img src="jobs-finder-logo.jpeg" alt="Jobs Finder" className="feature-logo" />
      <p>Explore and find jobs in your desired field and location.</p>
    </Link>
  </div>
</div>

   {/* Footer Section */}
   <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Yatharth. All rights reserved.</p>
          <ul className="footer-links">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Home;