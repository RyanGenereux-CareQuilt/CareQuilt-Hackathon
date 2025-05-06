import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import EventDialog from './EventDialog';
import {
  handleEventClick,
  handleAddOrUpdateEvent,
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

  // Wrap handlers to inject state
  const onEventClick = (info) =>
    handleEventClick(info, setForm, setSelectedDate, setOpen, format);
  const onAddOrUpdateEvent = () =>
    handleAddOrUpdateEvent(form, setEvents, setForm, setError);
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
          left: 'prev,next today',
          center: 'title',
          right: 'addEventButton,dayGridMonth,timeGridDay,timeGridWeek',
        }}
        views={{
          dayGridMonth: {
            buttonText: 'Month'
          },
          TimeGridDay: {
            type: 'TimeGrid',
            duration: { days: 1 },
            buttonText: 'Day',
          },
          TimeGridWeek: {
            type: 'TimeGrid',
            duration: { days: 7 },
            buttonText: 'Week',
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