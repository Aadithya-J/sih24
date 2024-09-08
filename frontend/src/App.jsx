import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./pages/home/Home.js";
import Login from "./pages/login/Login.js";
import Signup from "./pages/signup/Signup";
import Roadmap from "./pages/roadmap/generateRoadmap.js";
import Navbar from "./components/Navbar/Navbar.jsx";
import ResumeAnalyser from "./pages/resumeAnalyser/ResumeAnalyser.js";
import JobsFinder from "./pages/jobsFinder/jobsFinder.js";
import { useAuthContext } from "./hooks/useAuthContext";
import { StarsCanvas } from "./components/Navbar/StarsCanvas";
import CommunitySupport from "./pages/communitySupport/CommunitySupport";
import PersonalizedForm from "./pages/personalizedForm/PersonalizedForm";
// import TrainingRec from "./pages/trainingRec/trainingRec.js";
import VirtualEvents from './pages/virtualEvents/VirtualEvents';
import './App.css'; // Ensure you have global CSS for your app as needed

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <>
      {/* Starry Background */}
      <StarsCanvas />

      <div className="app-content">
        {authIsReady && (
          <>
            <Navbar />
            <Routes>
              <Route
                exact
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
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
                element = {user ? <JobsFinder /> : <Navigate to="/login" />}
              />

            </Routes>
          </>
        )}
      </div>
    </>
  );
}

export default App;


