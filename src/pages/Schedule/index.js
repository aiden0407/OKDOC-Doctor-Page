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

  return (
    <>
      <Text T2 bold>진료 스케줄 관리</Text>
      <FullCalendar
        editable
        selectable
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={[
          { title: 'event 1', date: '2023-08-18' },
          { title: 'event 2', date: '2023-08-18' }
        ]}
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