import React, { useState } from 'react';
import './PersonalizedForm.css'; // Import the CSS file for styling

function PersonalizedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    school: '',
    college: '',
    yearOfCollege: '', // New field for year of college
    role: '', // New field for mentor/mentee
    hobbies: '',
    skills: '',
    workExperience: '',
    accomplishments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="personalized-form">
      <h2 className="form-title">Personalized Experience Form</h2>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
          <label htmlFor="school">School:</label>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
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
          <label htmlFor="yearOfCollege">Year of College:</label>
          <input
            type="text"
            id="yearOfCollege"
            name="yearOfCollege"
            value={formData.yearOfCollege}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="mentor">Mentor</option>
            <option value="mentee">Mentee</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="hobbies">Hobbies:</label>
          <textarea
            id="hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills:</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="workExperience">Work Experience:</label>
          <textarea
            id="workExperience"
            name="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="accomplishments">Accomplishments:</label>
          <textarea
            id="accomplishments"
            name="accomplishments"
            value={formData.accomplishments}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default PersonalizedForm;
