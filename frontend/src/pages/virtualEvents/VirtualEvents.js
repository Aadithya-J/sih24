import React from 'react';
import styles from './VirtualEvents.module.css';

const VirtualEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Career Development Workshop',
      description: 'Join our career development workshop to enhance your skills.',
      date: 'September 15, 2024',
      time: '2:00 PM - 4:00 PM',
      platform: 'Zoom',
      link: 'https://example.com/career-development',
      image: 'https://via.placeholder.com/600x400' // Update with your image URL
    },
    {
      id: 2,
      title: 'Webinar for Special Needs Career Planning',
      description: 'A session dedicated to career planning for people with special needs.',
      date: 'September 18, 2024',
      time: '10:00 AM - 12:00 PM',
      platform: 'Google Meet',
      link: 'https://example.com/special-needs-webinar',
      image: 'https://via.placeholder.com/600x400' // Update with your image URL
    },
    {
      id: 3,
      title: 'Resume Building Workshop',
      description: 'Learn how to build a professional resume that stands out.',
      date: 'September 20, 2024',
      time: '5:00 PM - 7:00 PM',
      platform: 'Microsoft Teams',
      link: 'https://example.com/resume-building',
      image: 'https://via.placeholder.com/600x400' // Update with your image URL
    }
  ];

  const addToCalendarUrl = (event) => {
    // Replace this with your calendar integration logic
    // Example URL for Google Calendar
    return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(event.title)}&dates=${encodeURIComponent(event.date.replace(/ /g, 'T') + 'T' + event.time.split(' - ')[0].replace(/ /g, 'T') + 'Z')}/${encodeURIComponent(event.date.replace(/ /g, 'T') + 'T' + event.time.split(' - ')[1].replace(/ /g, 'T') + 'Z')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.platform)}`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Virtual Events</h2>
      <p className={styles.description}>
        Join virtual events, workshops, and webinars on career development, including sessions for people with special needs.
      </p>
      <div className={styles.grid}>
        {events.map((event) => (
          <div key={event.id} className={styles.card}>
            <img src={event.image} alt={event.title} className={styles.cardImage} />
            <h3 className={styles.cardTitle}>{event.title}</h3>
            <p className={styles.cardDescription}>{event.description}</p>
            <p className={styles.info}><strong>Date:</strong> {event.date}</p>
            <p className={styles.info}><strong>Time:</strong> {event.time}</p>
            <p className={styles.info}><strong>Platform:</strong> {event.platform}</p>
            <a href={addToCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Add to Calendar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualEvents;
