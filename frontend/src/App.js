import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import AIAssistPanel from './components/AIAssistPanel';
import { Button } from '@mui/material';
import axios from 'axios';
import './styles/styles.css';

function App() {
  const [aiOpen, setAIOpen] = useState(false);
  const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events');
        console.log('API Response:', response.data); // Debugging log

        const responseBody = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data.body;

        if (Array.isArray(responseBody)) {
          const fetchedEvents = responseBody.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description,
          }));
          setEvents(fetchedEvents);
        } else {
          console.error('Unexpected API response format:', responseBody);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  useEffect(() => {

    fetchEvents();
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', background: '#f5f5f5' }}>
        <h1 style={{ margin: 0, textAlign: 'center' }}>Calendar Application</h1>
      </header>

      <main style={{ flex: 1 }}>
        <Calendar events={events} setEvents={setEvents} />
      </main>

      <Button
        variant="outlined"
        onClick={() => setAIOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}
      >
        Open AI Assist
      </Button>
      <AIAssistPanel open={aiOpen} onClose={() => setAIOpen(false)} fetchEvents={fetchEvents} />
    </div>
  );
}

export default App;