import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './PersonalizedForm.css'; // Import the CSS file for styling
import { FaTimes } from 'react-icons/fa'; // Import the close icon from react-icons
import Confetti from 'react-confetti';

function PersonalizedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    school: '',
    college: '',
    yearOfCollege: '',
    role: '',
    hobbies: '',
    skills: '',
    workExperience: '',
    accomplishments: '',
  });

  const [resume, setResume] = useState(null); // State for the uploaded resume
  const [isVisible, setIsVisible] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null); // State to manage submission status
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmissionStatus('success'); // Set status to success to trigger confetti
    console.log('Form submitted:', formData);
    console.log('Resume file:', resume);

    // Add a delay before navigating to the home page to show confetti
    setTimeout(() => {
      navigate('/'); // Navigate to the home page after a delay
    }, 5000); // 5 seconds delay
  };

  const handleClose = () => {
    setIsVisible(false); // Hide the form when the close button is clicked
    navigate('/'); // Navigate back to the home page
  };

  if (!isVisible) return null; // Render nothing if form is not visible

  return (
    <div className="personalized-form">
      <div className="form-header">
        <h2 className="form-title">Personalized Experience Form</h2>
        <button className="close-button" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
       
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="college">College:</label>
          <input
            type="text"
            id="college"
            name="college"
            value={formData.college}
            onChange={handleChange}
          />
        </div>
    
    
    
        <div className="form-group">
          <label htmlFor="resume">Upload Resume (PDF only):</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {submissionStatus === 'success' && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <p className="submission-message">Form submitted successfully!</p>
        </>
      )}
    </div>
  );
}

export default PersonalizedForm;
