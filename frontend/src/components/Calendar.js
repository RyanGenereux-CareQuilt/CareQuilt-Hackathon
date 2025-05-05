import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Divider,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Chip,
  Stack,
  Alert
} from '@mui/material';

import { format, isWithinInterval, parseISO, set } from 'date-fns';


const FullCalendarView = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
  title: '',
  description: '',
  startTime: null,
  endTime: null,
  eventId: null,
});

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return {
      value: hour,
      label: format(set(new Date(), { hours: hour, minutes: 0 }), 'h:00 a'),
    };
  });
  
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setForm({
      title: '',
      description: '',
      startTime: null,
      endTime: null,
      eventId: null,
    });
    setError('');
    setOpen(true);
  };

  const handleAddOrUpdateEvent = () => {
    const { title, description, startTime, endTime } = form;
    if (!title || !startTime || !endTime || !selectedDate) return;
    
    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }
    const start = format(form.startTime, "yyyy-MM-dd'T'HH:mm:ss");
    const end = format(form.endTime, "yyyy-MM-dd'T'HH:mm:ss");

    if (form.eventId) {
      setEvents(prev =>
        prev.map(e =>
          e.id === form.eventId ? { ...e, title, description, start, end } : e
        )
      );
    } else {
      const newEvent = {
        id: crypto.randomUUID(),
        title,
        description,
        start,
        end,
        host: 'user123',
        attendees: [],
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setForm({
      title: '',
      description: '',
      startHour: '',
      endHour: '',
      eventId: null,
    });

    setError('');
  };
  
  const handleEditEvent = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
  
    setForm({
      title: event.title,
      description: event.description,
      startTime: start,
      endTime: end,
      eventId: event.id,
    });
    setError('');
  };
  
  
  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (form.eventId === id) {
      setForm({
        title: '',
        description: '',
        startTime: null,
        endTime: null,
        eventId: null,
      });
    }
  };
  
  const getEventsInHour = (hour) => {
    if (!selectedDate) return [];
    const hourStart = parseISO(`${selectedDate}T${String(hour).padStart(2, '0')}:00:00`);
    const hourEnd = parseISO(`${selectedDate}T${String(hour + 1).padStart(2, '0')}:00:00`);
  
    return events.filter(event => {
      const eventStart = parseISO(event.start);
      const eventEnd = parseISO(event.end);
      // Check if event overlaps with the hour interval
      return eventStart < hourEnd && eventEnd > hourStart;
    });
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        selectable={true}
        events={events}
        height="auto"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
          hour12: true,
        }}
      />

<Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Schedule for {selectedDate ? format(new Date(selectedDate), 'EEEE, MMMM d, yyyy') : ''}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Events on {selectedDate ? format(new Date(selectedDate), 'EEEE, MMMM d, yyyy') : ''}
          </Typography>

          {events.filter(e => e.start.startsWith(selectedDate)).length === 0 ? (
            <Typography variant="body2" sx={{ mt: 1 }}>No events scheduled.</Typography>
          ) : (
            events
              .filter(e => e.start.startsWith(selectedDate))
              .map((event) => (
                <Box key={event.id} sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                  <Typography variant="subtitle2">{event.title}</Typography>
                  <Typography variant="body2">
                    {format(parseISO(event.start), 'h:mm a')} – {format(parseISO(event.end), 'h:mm a')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {event.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button size="small" onClick={() => handleEditEvent(event)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                  </Stack>
                </Box>
              ))
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">{form.eventId ? 'Edit Event' : 'Create New Event'}</Typography>
          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            sx={{ mt: 1 }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <TimePicker
                label="Start Time"
                value={form.startTime}
                onChange={(newValue) =>
                  setForm((prev) => ({ ...prev, startTime: newValue }))
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
              <TimePicker
                label="End Time"
                value={form.endTime}
                onChange={(newValue) =>
                  setForm((prev) => ({ ...prev, endTime: newValue }))
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Stack>
          </LocalizationProvider>

          <Button
            onClick={handleAddOrUpdateEvent}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {form.eventId ? 'Update Event' : 'Add Event'}
          </Button>
        </DialogContent>

      </Dialog>
    </>
  );
};
export default FullCalendarView;
