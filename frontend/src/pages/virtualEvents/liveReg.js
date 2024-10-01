import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './CreateEvent.css';


// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const CreateEvent = () => {
  useEffect(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventName = e.target.elements['event-name'].value;
    const eventDate = e.target.elements['event-date'].value;

    // Convert date to a string in YYYY-MM-DD format
    const dateAsString = new Date(eventDate).toISOString().split('T')[0];

    // Adding event to Firestore 'events' collection
    try {
      const db = firebase.firestore();
      await db.collection('events').add({
        name: eventName,
        date: dateAsString // Storing date as string
      });
      alert('Event successfully added!');
      e.target.reset(); // Reset the form after submission
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div>
      <h1>Create a New Event</h1>
      <form id="event-form" onSubmit={handleSubmit}>
        <label htmlFor="event-name">Event Name:</label><br />
        <input type="text" id="event-name" name="event-name" required /><br /><br />
        <label htmlFor="event-date">Event Date:</label><br />
        <input type="date" id="event-date" name="event-date" required /><br /><br />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
