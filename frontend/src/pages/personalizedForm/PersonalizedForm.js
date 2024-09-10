import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalizedForm.css';
import { FaTimes } from 'react-icons/fa';
import Confetti from 'react-confetti';

function PersonalizedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    college: '',
  });

  const [resume, setResume] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('resume', resume);
  
    // Get UID from localStorage
    const uid = localStorage.getItem('uid');
    if (uid) {
      formDataToSend.append('uid', uid);
    }
  
    try {
      const response = await fetch('http://localhost:4000/upload-resume', {
        method: 'POST',
        body: formDataToSend,
        // Remove the 'Content-Type' header, let the browser set it automatically for FormData
      });
  
      if (response.ok) {
        const data = await response.json();
        setSubmissionStatus('success');
        console.log('Form submitted:', formData);
        console.log('Resume file uploaded successfully. Download URL:', data.downloadUrl);
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        throw new Error('Failed to upload resume');
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error uploading resume:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    navigate('/');
  };

  if (!isVisible) return null;

  return (
    <div className="personalized-form">
      <div className="form-header">
        <h2 className="form-title">Personalized Experience Form</h2>
        <button className="close-button" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="form-content">
        {['name', 'email', 'phone', 'city', 'college'].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== 'college'}
            />
          </div>
        ))}
        <div className="form-group">
          <label htmlFor="resume">Upload Resume (PDF only):</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf"
            onChange={handleFileChange}
            required
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