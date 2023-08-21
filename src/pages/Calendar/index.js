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

//Api
import { getScheduleByDoctorId } from 'api/Schedule';

function Calendar() {

  const navigate = useNavigate();
  const [events, setEvents] = useState([
    { title: 'event 1', date: '2023-08-01', url: '/calendar/detail' },
    { title: 'event 2', date: '2023-08-02', url: '/calendar/detail' }
  ]);

  useEffect(() => {
    initScheduleData()
  }, []);

  const initScheduleData = async function () {
    try {
      const response = await getScheduleByDoctorId();
      let scheduleList = [];
      
      response.data.response.forEach((appointment) => {

        // const date = new Date(schedule.open_at);
        //   const day = date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('.', '/').replace('.', '').replace(' ', '');
        //   const weekday = date.toLocaleDateString('ko-KR', { weekday: 'long' }).slice(-3);
        //   let time = date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' });
        //   if (time.startsWith('24:')) {
        //     time = time.replace('24:', '00:');
        //   }
          
        scheduleList.push({
          title: `${appointment.patient.passport.user_name} / ${appointment.status==='RESERVATION_CONFIRMED'?'예약':'완료'}`,
          date: appointment.wish_at,
          //date: '2023-08-02',
          //date: "2023-08-04T01:30:00.000Z",
          url: `/calendar/detail?id=${appointment.id}`,
          eventDisplay: 'background'
        });
      });

      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-04T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
        eventDisplay: 'background'
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-04T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
        eventDisplay: 'background'
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-04T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
        eventDisplay: 'background'
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-04T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
        eventDisplay: 'background'
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-04T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
        eventDisplay: 'background'
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-04T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
        eventDisplay: 'background'
      });

      setEvents(scheduleList);

    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  return (
    <>
      <Text T2 bold>원격진료 진료 현황</Text>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={function(info) {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            navigate(`${info.event.url}`);
          }
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        //eventDisplay='block'
        eventColor={COLOR.SUB2}
        eventTextColor='black'
        dayMaxEventRows={4}


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