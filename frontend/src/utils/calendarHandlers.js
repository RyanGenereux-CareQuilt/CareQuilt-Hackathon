import { getDeviceId } from './deviceId';
import axios from 'axios';

export const handleEventClick = async(info, setForm, setSelectedDate, setOpen, format) => {
  const event = info.event;
  const start = new Date(event.start);
  const end = new Date(event.end);

  setForm({
    title: event.title,
    description: event.extendedProps.description || '',
    startdate: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
    endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate()),
    startTime: start,
    endTime: end,
    eventId: event.id,
  });

  setSelectedDate(format(start, 'yyyy-MM-dd'));
  setOpen(true);
};

export const handleAddEvent = async (form, setEvents, setForm, setError, onSuccess) => {
  const { eventId, title, description, startdate, endDate, startTime, endTime } = form;
  if (!title || !startdate || !endDate || !startTime || !endTime) {
    setError('All fields must be filled out.');
    return;
  }

  const start = new Date(
    startdate.getFullYear(),
    startdate.getMonth(),
    startdate.getDate(),
    startTime.getHours(),
    startTime.getMinutes()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    endTime.getHours(),
    endTime.getMinutes()
  );

  if (end <= start) {
    setError('End time must be after start time.');
    return;
  }

  try {
    const payload = {
      id: eventId,
      title,
      description,
      start: start.toISOString(),
      end: end.toISOString(),
      host: getDeviceId(),
      attendees: [],
    };
    console.log('Payload:', payload);
    const response = await axios.post('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
    
    // Parse the response body if it's a JSON string
    const responseBody = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data.body;
    console.log('Parsed Backend Response:', responseBody); // Debugging log

    // Use the ID returned from the backend
    const createdEvent = responseBody;
    if (!createdEvent.id) {
      console.error('Error: Backend did not return an ID for the created event.');
      return;
    }

    // Update the frontend state
    setEvents(prev => [
      ...prev,
      {
        id: createdEvent.id, // Use the backend-generated ID
        title,
        description,
        start: start.toISOString(),
        end: end.toISOString(),
      }
    ]);

    setError('');
    setForm({
      title: '',
      description: '',
      startdate: new Date(),
      endDate: new Date(),
      startTime: null,
      endTime: null,
      eventId: null,
    });
    
  if (onSuccess) onSuccess();
  } catch (err) {
    console.error('Error creating/updating event:', err);
  }
};


export const handleUpdateEvent = async (form, setEvents, setForm, setError, onSuccess) => {
  const { eventId, title, description, startdate, endDate, startTime, endTime } = form;
  if (!title || !startdate || !endDate || !startTime || !endTime) {
    setError('All fields must be filled out.');
    return;
  }

  const start = new Date(
    startdate.getFullYear(),
    startdate.getMonth(),
    startdate.getDate(),
    startTime.getHours(),
    startTime.getMinutes()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    endTime.getHours(),
    endTime.getMinutes()
  );

  if (end <= start) {
    setError('End time must be after start time.');
    return;
  }

  try {
    const payload = {
      id: eventId,
      title,
      description,
      start: start.toISOString(),
      end: end.toISOString(),
      host: getDeviceId(),
      attendees: [],
    };
    console.log('Payload:', payload);
    const response = await axios.put('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
    console.log(response.data);
    
    // Update the frontend state
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, title, description, start: start.toISOString(), end: end.toISOString() }
          : e
      )
    );

    setError('');
    setForm({
      title: '',
      description: '',
      startdate: new Date(),
      endDate: new Date(),
      startTime: null,
      endTime: null,
      eventId: null,
    });
  if (onSuccess) onSuccess();
  } catch (err) {
    console.error('Error updating event:', err);
    setError('Error updating event');
  }
};

export const handleDeleteEvent = async (id, setEvents, form, setForm) => {
  try {
    console.log('Deleting event with ID:', id); // Debugging log
    // Make an API call to delete the event from the database
    await axios.delete(`https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events/${id}`); // Replace with your actual API endpoint

    // Update the frontend state
    setEvents(prev => prev.filter(e => e.id !== id));
    if (form.eventId === id) {
      setForm({
        title: '',
        description: '',
        startdate: new Date(),
        endDate: new Date(),
        startTime: null,
        endTime: null,
        eventId: null,
      });
    }
  } catch (error) {
    console.error('Error deleting event:', error); // Debugging log
  }
};

export const handleEventDrop = async (info, setEvents, setError) => {
  const { id, start, end, title, extendedProps } = info.event;

  setEvents((prev) =>
    prev.map((e) =>
      e.id === id
        ? {
            ...e,
            start: start.toISOString(),
            end: end ? end.toISOString() : start.toISOString(),
          }
        : e
    )
  );

  try {
    const payload = {
      id,
      title,
      description: extendedProps?.description || '',
      start: start.toISOString(),
      end: end ? end.toISOString() : start.toISOString(),
      host: getDeviceId(),
      attendees: extendedProps?.attendees || [],
    };
    console.log('Payload:', payload);
    const response = await axios.put('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
    console.log(response.data);
    setError && setError('');
  } catch (err) {
    console.error('Error updating event:', err);
    setError && setError('Error updating event');
  }
};

export const handleEventResize = async (info, setEvents, setError) => {
  const { id, start, end, title, extendedProps } = info.event;

  setEvents((prev) =>
    prev.map((e) =>
      e.id === id
        ? {
            ...e,
            start: start.toISOString(),
            end: end.toISOString(),
          }
        : e
    )
  );

  try {
    const payload = {
      id,
      title,
      description: extendedProps?.description || '',
      start: start.toISOString(),
      end: end.toISOString(),
      host: getDeviceId(),
      attendees: extendedProps?.attendees || [],
    };
    console.log('Payload:', payload);
    const response = await axios.put('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
    console.log(response.data);
    setError && setError('');
  } catch (err) {
    console.error('Error updating event:', err);
    setError && setError('Error updating event');
  }
};