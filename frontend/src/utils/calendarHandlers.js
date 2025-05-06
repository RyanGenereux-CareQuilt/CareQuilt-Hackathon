import { getDeviceId } from './deviceId';

export const handleEventClick = (info, setForm, setSelectedDate, setOpen, format) => {
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

export const handleAddOrUpdateEvent = (form, setEvents, setForm, setError) => {
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

  if (eventId) {
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId ? { ...e, title, description, start, end } : e
      )
    );
  } else {
    const newEvent = {
      id: crypto.randomUUID(),
      title,
      description,
      start: start.toISOString(),
      end: end.toISOString(),
      host: getDeviceId(),
      attendees: [],
    };
    setEvents(prev => [...prev, newEvent]);
  }

  setForm({
    title: '',
    description: '',
    startdate: new Date(),
    endDate: new Date(),
    startTime: null,
    endTime: null,
    eventId: null,
  });

  setError('');
};

export const handleDeleteEvent = (id, setEvents, form, setForm) => {
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
};

export const handleEventDrop = (info, setEvents) => {
  const { id, start, end } = info.event;

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
};

export const handleEventResize = (info, setEvents) => {
  const { id, start, end } = info.event;

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
};
