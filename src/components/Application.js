import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment";

import { getAppointmentsForDay, getInterview } from "helpers/selectors";

export default function Application(props) {
  
  const [state, setState] = useState({
    day:"Monday",
    days:[],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const setDay = day => setState(prev => ({...prev, day}));
  
  useEffect(() => {
    const urlDays="http://localhost:8001/api/days";
    const urlAppointments="http://localhost:8001/api/appointments";
    const urlInterviews="http://localhost:8001/api/interviewers";
    Promise.all([
      axios.get(urlDays),
      axios.get(urlAppointments),
      axios.get(urlInterviews)
    ]).then((all) => {
      const [daysData, appointmentsData, interviewersData] = all;
      const days = daysData.data;
      const appointments = appointmentsData.data;
      const interviewers = interviewersData.data;
      setState(prev => ({...prev, days, appointments, interviewers}));
    })
  }, []);
  
  return (
    <main className="layout">
      <section className="sidebar">
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler"/>
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={day => setDay(day)}
          />
        </nav>
        <img className="sidebar__lhl sidebar--centered" src="images/lhl.png" alt="Lighthouse Labs"/>
      </section>
      <section className="schedule">
        {dailyAppointments.map(appointment => {
          const interview = getInterview(state, appointment.interview);
          return (
            <Appointment 
              key={appointment.id}
              {...appointment}
              interview={interview}
            />
          )
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
