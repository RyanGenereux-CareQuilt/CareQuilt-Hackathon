import React, { useState } from 'react';
import Calendar from './components/Calendar';
import AIAssistPanel from './components/AIAssistPanel';
import { Button } from '@mui/material';
// import './styles/styles.css';

function App() {
  const [aiOpen, setAIOpen] = useState(false);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', background: '#f5f5f5' }}>
        <h1 style={{ margin: 0, textAlign: 'center' }}>Calendar Application</h1>
      </header>

      <main style={{ flex: 1 }}>
        <Calendar />
      </main>

      <Button
        variant="outlined"
        onClick={() => setAIOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}
      >
        Open AI Assist
      </Button>
      <AIAssistPanel open={aiOpen} onClose={() => setAIOpen(false)} />
    </div>
  );
}


export default App;