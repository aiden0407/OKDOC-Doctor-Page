//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'constants/design';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, FlexBox, DividingLine } from 'components/Flex';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {

  const navigate = useNavigate();
  const [events, setEvents] = useState([
    { title: 'event 1', date: '2023-08-01', url: '/calendar/detail' },
    { title: 'event 2', date: '2023-08-02', url: '/calendar/detail' }
  ]);

  return (
    <>
      <Text T2 bold>원격진료 진료 현황</Text>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={(info) => {
          console.log(info);
          const eventNamePrompt = prompt("Enter, event name");
          if (eventNamePrompt) {
            setEvents([
              ...events,
              {
                date: info.dateStr,
                title: eventNamePrompt,
                url: '/calendar/detail'
              },
            ]);
          }
        }}
        events={events}
        eventClick={function(info) {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            navigate(`${info.event.url}`);
          }
        }}
      />
    </>
  );
}

export default Calendar;

const CalendarContainer = styled.div`
  width: 100%;
  padding: 48px 0;
  display: flex;
  flex-direction: column;
`