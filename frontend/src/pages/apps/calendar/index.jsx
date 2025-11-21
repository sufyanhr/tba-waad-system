import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

// third-party
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';

// project import
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import CalendarStyled from 'sections/apps/calendar/CalendarStyled';
import Toolbar from 'sections/apps/calendar/Toolbar';
import AddEventForm from 'sections/apps/calendar/AddEventForm';

import { dispatch, useSelector } from 'store';
import { getEvents, selectEvent, selectRange, toggleModal, updateEvent } from 'store/reducers/calendar';

// ==============================|| CALENDAR ||============================== //

export default function Calendar() {
  const theme = useTheme();
  const calendarRef = useRef(null);
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(matchSm ? 'listWeek' : 'dayGridMonth');

  const { calendarView, events, isModalOpen, selectedEventId, selectedRange } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(getEvents()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setView(calendarView);
  }, [calendarView]);

  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const handleRangeSelect = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }

    dispatch(selectRange(arg.start, arg.end));
  };

  const handleEventSelect = (arg) => {
    if (arg.event.id) {
      dispatch(selectEvent(arg.event.id));
    }
  };

  const handleEventUpdate = async ({ event }) => {
    try {
      dispatch(
        updateEvent({
          eventId: event.id,
          update: {
            allDay: event.allDay,
            start: event.start,
            end: event.end
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleModal = () => {
    dispatch(toggleModal());
  };

  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ position: 'relative' }}>
      <MainCard
        title="Calendar"
        secondary={
          <Toolbar
            date={date}
            view={view}
            onClickNext={handleDateNext}
            onClickPrev={handleDatePrev}
            onClickToday={handleDateToday}
            onChangeView={handleViewChange}
          />
        }
      >
        <CalendarStyled>
          <FullCalendar
            weekends
            editable
            droppable
            selectable
            events={events}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            allDayMaintainDuration
            eventResizableFromStart
            select={handleRangeSelect}
            eventDrop={handleEventUpdate}
            eventClick={handleEventSelect}
            eventResize={handleEventUpdate}
            height={matchSm ? 'auto' : 720}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
          />
        </CalendarStyled>
      </MainCard>

      {/* Dialog renders its body even if not open */}
      <Dialog maxWidth="sm" fullWidth onClose={handleModal} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        <AddEventForm event={events.find((_event) => _event.id === selectedEventId)} range={selectedRange} onCancel={handleModal} />
      </Dialog>
    </Box>
  );
}
