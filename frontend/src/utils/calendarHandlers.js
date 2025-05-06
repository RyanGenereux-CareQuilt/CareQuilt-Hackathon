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
// Not posting right now, I am unsure why it might be because of the operation in payload
export const handleAddEvent = async (form, setEvents, setForm, setError) => {
  const { title, description, startdate, endDate, startTime, endTime } = form;
  if (!title || !startdate || !endDate || !startTime || !endTime) {
    setError('All fields must be filled out.');
    return;
  }

  try {
    const payload = {
      body: {
        Id: crypto.randomUUID(),
        title: form.title,
        description: form.description,
        start: new Date(`${form.startdate}`).toISOString(),
        end: new Date(`${form.endDate}`).toISOString(),
        host: getDeviceId(),
        attendees: [],
      },
    };

    console.log('Payload:', payload); // Log the payload for debugging
    const response = await axios.post('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
    console.log(response.data);
    setError('');
  } catch (err) {
    console.error('Error creating/updating event:', err);
  }
};


export const handleUpdateEvent = async (form, setEvents, setForm, setError) => {
  const { title, description, startdate, endDate, startTime, endTime, eventId } = form;
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
    setError('End date/time must be after start date/time.');
    return;
  }
  try{

    const payload = {
      body: {
        id: eventId,
        title,
        description,
        start: start.toISOString(),
        end: end.toISOString(),
        host: getDeviceId(),
      },
    };
    console.log('Payload:', payload); // Log the payload for debugging
      const response = await axios.put('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
      console.log(response.data);
      setError('');
    } catch (err) {
      console.error('Error updating event:', err)
  };
  
};

export const handleDeleteEvent = async (id, setEvents, form, setForm, setError) => {
  setEvents(prev => prev.filter(e => e.id !== id));
  if (form.eventId === id) {
    
      try{
        const payload = {
          body: {
            id,
            title: '',
            description: '',
            startdate: new Date(),
            endDate: new Date(),
            startTime: null,
            endTime: null,
            eventId: null,
          },
        };
        console.log('Payload:', payload); // Log the payload for debugging
        const response = await axios.delete('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
        console.log(response.data);
        setError('');
      } catch (err) {
        console.error('Error creating event:', err)
    }
  }; 
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

  try{

    const payload = {
      body: {
        id,
        title,
        description: extendedProps?.description || '',
        start: start.toISOString(),
        end: end.toISOString(),
        host: getDeviceId(),
      },
    };
    console.log('Payload:', payload); // Log the payload for debugging
      const response = await axios.put('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
      console.log(response.data);
      setError('');
    } catch (err) {
      console.error('Error updating event:', err)
  };

};

export const handleEventResize = async (info, setEvents, setError) => {
  const { id, start, end, title, extendedProps} = info.event;

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

  try{

    const payload = {
      body: {
        id,
        title,
        description: extendedProps?.description || '',
        start: start.toISOString(),
        end: end.toISOString(),
        host: getDeviceId(),
      },
    };
    console.log('Payload:', payload); // Log the payload for debugging
      const response = await axios.put('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events', payload);
      console.log(response.data);
      setError('');
    } catch (err) {
      console.error('Error updating event:', err)
  };
};
