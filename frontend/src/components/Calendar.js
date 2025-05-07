import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import EventDialog from './EventDialog';
import {
  handleEventClick,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleEventDrop,
  handleEventResize,
} from '../utils/calendarHandlers';

const FullCalendarView = ({ events, setEvents }) => {
  const [open, setOpen] = useState(false);
  const [, setSelectedDate] = useState(null);
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

  const onEventClick = (info) =>
    handleEventClick(info, setForm, setSelectedDate, setOpen, format);
  const onAddOrUpdateEvent = () => {
    const closeDialog = () => setOpen(false);
    if (form.eventId) {
      handleUpdateEvent(form, setEvents, setForm, setError, closeDialog);
    } else {
      handleAddEvent(form, setEvents, setForm, setError, closeDialog);
    }
  };
  const onDeleteEvent = (id) =>
    handleDeleteEvent(id, setEvents, form, setForm);
  const onEventDrop = (info) =>
    handleEventDrop(info, setEvents);
  const onEventResize = (info) =>
    handleEventResize(info, setEvents);

  const renderEventContent = (eventInfo) => (
    <div style={{ color: '#000000' }}>
      <b>{eventInfo.timeText}</b>
      <div>{eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.description && (
        <div style={{ fontSize: '0.85em', color: '#1E3D59' }}>
          {eventInfo.event.extendedProps.description}
        </div>
      )}
    </div>
  );

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
        buttonText={{
          today: 'Today',
        }}
        views={{
          dayGridMonth: {
            buttonText: 'Month',
          },
          timeGridDay: {
            buttonText: 'Day',
          },
          timeGridWeek: {
            buttonText: 'Week',
          },
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
        eventContent={renderEventContent}
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