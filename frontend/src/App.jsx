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
import VirtualEvents from "./pages/virtualEvents/VirtualEvents";
import SkillsVerification from "./pages/skillsVerification/skillsVerification.js";
import ResumeComparator from "./pages/resumeComparator/resumeComparator.js";
import UserProfile from "./pages/userProfile/UserProfile";
import "./App.css";

function App() {
  const [userIsSignedIn, setUserIsSignedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {
    const handleTokenChange = () => {
      setUserIsSignedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem("uid"); // Get UID from localStorage
      try {
        const response = await axios.post(
          "http://localhost:4000/get-user-data",
          { uid }
        );
        const data = response.data;
        console.log("User data:", data);
        // Set default values for missing fields
        setUserData({
          name: data.name || "John Doe",
          profileLogo: data.profileLogo || "https://via.placeholder.com/100",
          email: data.email || "",
          city: data.city || "City",
          college: data.college || "College",
          activeDays: data.activeDays || [1, 1, 0, 1, 0, 1, 1],
          ratingHistory: data.ratingHistory || [10, 20, 30, 40, 50],
          atsScore: data.atsScore || 80,
        });
      } catch (error) {
        setError("Error fetching user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <Home />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
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
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <Roadmap />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/resume-analyser"
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <ResumeAnalyser />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/resume-comparator"
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <ResumeComparator />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/community-support"
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <CommunitySupport />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/personalized-form" element={<PersonalizedForm />} />
            <Route path="/virtual-events" element={
                userIsSignedIn ? (
                  error == null ? (
                    <VirtualEvents />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              } />
            <Route
              path="/jobsfinder"
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <JobsFinder />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/training"
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <TrainingRec />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/skills"
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <SkillsVerification />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/profile"
              element={
                userIsSignedIn ? (
                  error == null ? (
                    <UserProfile />
                  ) : (
                    <Navigate to="/personalized-form" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </>
      </div>
    </>
  );
}

export default App;
