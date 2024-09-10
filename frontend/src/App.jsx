import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./pages/home/Home.js";
import Login from "./pages/login/Login.js";
import Signup from "./pages/signup/Signup";
import Roadmap from "./pages/roadmap/generateRoadmap.js";
import Navbar from "./components/Navbar/Navbar.jsx";
import ResumeAnalyser from "./pages/resumeAnalyser/ResumeAnalyser.js";
import JobsFinder from "./pages/jobsFinder/jobsFinder.js";
import { StarsCanvas } from "./components/Navbar/StarsCanvas";
import CommunitySupport from "./pages/communitySupport/CommunitySupport";
import PersonalizedForm from "./pages/personalizedForm/PersonalizedForm";
import TrainingRec from "./pages/trainingRec/trainingRec.js";
import VirtualEvents from './pages/virtualEvents/VirtualEvents';
import SkillsVerification from "./pages/skillsVerification/skillsVerification.js";
import UserProfile from './pages/userProfile/UserProfile';
import './App.css';

function App() {
  const [userIsSignedIn, setUserIsSignedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleTokenChange = () => {
      setUserIsSignedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, []);

  return (
    <>
      {/* Starry Background */}
      <StarsCanvas />

      <div className="app-content">
          <>
            <Navbar />
            <Routes>
              <Route
                exact
                path="/"
                element={userIsSignedIn ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!userIsSignedIn ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!userIsSignedIn ? <Signup /> : <Navigate to="/" />}
              />
              <Route
                path="/roadmap"
                element={<Roadmap />}
              />
              <Route 
                path="/resume-analyser"
                element={<ResumeAnalyser />}
              />
              <Route path="/community-support" element={<CommunitySupport />} />
               <Route path="/personalized-form" element={<PersonalizedForm />} />
               <Route path="/virtual-events" element={<VirtualEvents />} />
              <Route
                path="/jobsfinder"
                element = {userIsSignedIn ? <JobsFinder /> : <Navigate to="/login" />}
              />

              <Route
                path="/training"
                element = {userIsSignedIn ? <TrainingRec /> : <Navigate to="/login" />}
              />

              <Route
                path="/skills"
                element = {userIsSignedIn ? <SkillsVerification /> : <Navigate to="/login" />}
              />
             <Route
            path="/profile"
            element={userIsSignedIn ? <UserProfile /> : <Navigate to="/login" />}
          />

            </Routes>
          </>
      </div>
    </>
  );
}

export default App;


