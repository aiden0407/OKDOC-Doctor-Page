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
          
        scheduleList.push({
          title: `${appointment.patient.passport.user_name} / ${appointment.status==='RESERVATION_CONFIRMED'?'예약':'완료'}`,
          date: appointment.wish_at,
          url: `/calendar/detail?id=${appointment.id}`,
        });
      });

      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-21T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-16T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-22T00:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-28T09:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-28T09:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-28T09:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-28T09:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });
      scheduleList.push({
        title: '이준범 / 예약',
        date: "2023-08-28T09:30:00.000Z",
        url: `/calendar/detail?id=${1234}`,
      });

      setEvents(scheduleList);

    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  return (
    <CalendarContainer>
      <Text T2 bold>원격진료 진료 현황</Text>

      <ScheduleInfoBox right={450}>
        <Text T3 bold>오늘 예약 건</Text>
        <Row marginTop={15} style={{alignItems: 'flex-start'}}>
          <Text T1 bold color={COLOR.MAIN} style={{fontSize: 40}}>1</Text>
          <Text T4 bold color={COLOR.MAIN} marginTop={2} marginLeft={6}>건</Text>
        </Row>
      </ScheduleInfoBox>

      <ScheduleInfoBox right={110}>
        <Text T3 bold>이번 달 남은 예약 건</Text>
        <Row marginTop={15} style={{alignItems: 'flex-start'}}>
          <Text T1 bold style={{fontSize: 40}}>11</Text>
          <Text T4 bold color={COLOR.GRAY2} marginTop={2} marginLeft={6}>/ 20 건</Text>
        </Row>
      </ScheduleInfoBox>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        contentHeight={650}
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'prev,next'
        }}
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
          hour12: false,
        }}
        eventColor={COLOR.SUB2}
        eventTextColor='black'
        dayMaxEventRows={4}
        locale="kr"
      />
    </CalendarContainer>
  );
}

export default Calendar;

const CalendarContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 0 0 60px 0;
  display: flex;
  flex-direction: column;
`

const ScheduleInfoBox = styled.div`
  position: absolute;
  top: 0;
  right: ${(props) => `${props.right}px`};
  width: 320px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0px 20px 40px 0px rgba(134, 142, 150, 0.10);
  @media screen and (max-width: 1280px) {
    transform: scale(0.8);
    top: 5px;
    right: ${(props) => `${props.right*4/5-10}px`};
  }
`