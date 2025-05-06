import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, isPast } from "date-fns";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import "../styles/AlumniEventCalendar.css";

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
      const response = await axios.get("/api/v1/events/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data.events;

      const formattedEvents = data.map((event) => ({
        title: event.title,
        start: new Date(event.date),
        end: new Date(event.date),
        allDay: true,
        isPast: isPast(new Date(event.date)), // Determine if the event date is in the past
        originalData: event, // Keep the original event data if needed later
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: event.isPast ? "#ccc" : "#9f1c33",
      color: event.isPast ? "#666" : "white",
      border: "0",
      borderRadius: "5px",
      opacity: 0.8,
      display: "block",
    };
    return {
      style,
    };
  };

  const dayPropGetter = (date) => {
    if (isPast(date)) {
      return {
        className: "past-date",
      };
    }
    return {};
  };

  return (
    <div className="alumni-calendar-container">
      <h2 className="calendar-title">Alumni Event Calendar</h2>
      <p className="calendar-subtitle">
        Stay updated on alumni gatherings and happenings.
      </p>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="alumni-calendar"
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
};

export default AlumniEventCalendar;
