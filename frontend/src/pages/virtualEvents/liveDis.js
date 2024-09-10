import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './EventList.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIFT3gkD1qIDlK3X2wUS2dRLZnzatQlMM",
  authDomain: "yatharth-24.firebaseapp.com",
  projectId: "yatharth-24",
  storageBucket: "yatharth-24.appspot.com",
  messagingSenderId: "658651371540",
  appId: "1:658651371540:web:ee19d8a89bd758412baf01",
  measurementId: "G-T9D9ZTJKS8"
};

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();
    
    // Fetch events from Firestore
    const fetchEvents = async () => {
      try {
        const snapshot = await db.collection('events').get();
        const eventList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>List of Events</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.name} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
