import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import "../styles/AlumniEventCalendar.css"; // Import the CSS file

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AlumniEventCalendar = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/events/get",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data.events;

      const formattedEvents = data.map((event) => ({
        title: event.title,
        start: new Date(event.date),
        end: new Date(event.date),
        allDay: true,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="alumni-calendar-container">
      <h2>Upcoming Alumni Events</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="alumni-calendar"
      />
    </div>
  );
};

export default AlumniEventCalendar;
