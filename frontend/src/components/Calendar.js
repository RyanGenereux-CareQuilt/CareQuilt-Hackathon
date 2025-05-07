import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import axios from 'axios';
import EventDialog from './EventDialog';
import {
  handleEventClick,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleEventDrop,
  handleEventResize,
} from '../utils/calendarHandlers';

const FullCalendarView = () => {
  const [open, setOpen] = useState(false);
  const [, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    startdate: new Date(),
    endDate: new Date(),
    startTime: null,
    endTime: null,
    eventId: null,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://pm58gyiwt6.execute-api.us-east-2.amazonaws.com/v11/events');
        console.log('API Response:', response.data); // Debugging log

        // Parse the body if it's a JSON string
        const responseBody = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data.body;

        // Ensure responseBody is an array before mapping
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

    fetchEvents();
  }, []);

  const onEventClick = (info) =>
    handleEventClick(info, setForm, setSelectedDate, setOpen, format);
  const onAddOrUpdateEvent = () => {
    const closeDialog = () => setOpen(false);
    if (form.eventId) {
      handleUpdateEvent(form, setEvents, setForm, setError, closeDialog);
    } else {
      handleAddEvent(form, setEvents, setForm, setError, closeDialog);
    };
  }; 
    const onDeleteEvent = (id) =>
    handleDeleteEvent(id, setEvents, form, setForm);
  const onEventDrop = (info) =>
    handleEventDrop(info, setEvents);
  const onEventResize = (info) =>
    handleEventResize(info, setEvents);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        allDaySlot={false}
        customButtons={{
          addEventButton: {
            text: '+',
            click: () => {
              setForm({
                title: '',
                description: '',
                startdate: null,
                endDate: null,
                startTime: null,
                endTime: null,
                eventId: null,
              });
              setOpen(true);
            },
          },
        }}
        headerToolbar={{
          left: 'prev,next, today',
          center: 'title',
          right: 'addEventButton,dayGridMonth,timeGridDay,timeGridWeek',
        }}
        buttonText={{
          today: 'Today',
        }}
        views={{
          dayGridMonth: {
            buttonText: 'Month'
          },
          timeGridDay: {
            buttonText: 'Day',
          },
          timeGridWeek: {
            buttonText: 'Week'
          }
        }}
        height="100%"
        eventClick={onEventClick}
        selectable={true}
        events={events}
        editable={true}
        eventStartEditable={true}
        eventDurationEditable={true}
        eventDrop={onEventDrop}
        eventResize={onEventResize}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
          hour12: true,
        }}
        size="full"
      />
      <EventDialog
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        error={error}
        onAddOrUpdateEvent={onAddOrUpdateEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </>
  );
};
export default FullCalendarView;