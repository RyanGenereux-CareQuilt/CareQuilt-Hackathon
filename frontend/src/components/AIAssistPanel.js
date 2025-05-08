import axios from 'axios'; // Import axios for API calls
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AIAssistPanel = ({ open, onClose, fetchEvents }) => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const [sessionId, setSessionId] = useState(undefined);

  if (!open) return null;

  const askAgent = async () => axios.post("https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/agent", {
    sessionId,
    query: ( !sessionId ? "All times provided are offset by " + -1*(new Date().getTimezoneOffset()) + " minutes from UTC. Convert these times to UTC before creating and updating events." : "") + input
  })

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput('');

    // add temporary message
    setMessages(prev => [...prev, { from: 'ai', text: "..."}])
    askAgent().then(async (response) => {
      const body = JSON.parse(response.data.body);
      setSessionId(body.sessionId);
      setMessages(prev => prev.map((e,i) => i === prev.length - 1 ? {from: "ai", text: response.data.statusCode === 200 ? body.response : "An error occured. Please try again later"} : e)); //replace message
      await fetchEvents(); // fetch events after getting response
    }).catch((error) => {
      console.error("Error:", error);
      setMessages(prev => prev.map((e,i) => i === prev.length - 1 ? {from: "ai", text: "An error occured. Please try again later"} : e)); //replace message
    });
  };



  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 320,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1300,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          bgcolor: '#000000',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          AI Assist
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'primary.contrastText' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          overflowY: 'auto',
          bgcolor: '#f5f5f5',
        }}
      >
        <Stack spacing={1}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                bgcolor: msg.from === 'user' ? 'primary.main' : 'grey.300',
                color: msg.from === 'user' ? 'primary.contrastText' : 'text.primary',
                px: 1.5,
                py: 1,
                borderRadius: 2,
                maxWidth: '80%',
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: 1, borderTop: '1px solid #ccc' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value.trimStart())}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your message..."
            size="small"
            fullWidth
            multiline
            maxRows={3}
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AIAssistPanel;
