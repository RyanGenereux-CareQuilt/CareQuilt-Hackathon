import React from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import { LocalizationProvider, TimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EventDialog = ({
  open,
  setOpen,
  form,
  setForm,
  error,
  onAddOrUpdateEvent,
  onDeleteEvent,
}) => (
  <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
    <DialogContent>
      <Typography variant="h4">{form.eventId ? 'Edit Event' : 'Create New Event'}</Typography>
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

          <DatePicker
            label="Start Date"
            value={form.startdate}
            onChange={(newValue) =>
              setForm((prev) => ({ ...prev, startdate: newValue }))
            }
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

          <DatePicker
            label="End Date"
            value={form.endDate}
            onChange={(newValue) =>
              setForm((prev) => ({ ...prev, endDate: newValue }))
            }
            renderInput={(params) => <TextField fullWidth {...params} />}
          />

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
        onClick={onAddOrUpdateEvent}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {form.eventId ? 'Update Event' : 'Add Event'}
      </Button>

      {form.eventId && (
        <Button
          onClick={() => onDeleteEvent(form.eventId)}
          variant="outlined"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
        >
          Delete Event
        </Button>
      )}
    </DialogContent>
  </Dialog>
);

export default EventDialog;
