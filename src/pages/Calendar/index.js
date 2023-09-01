//React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Row } from 'components/Flex';

//FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'design/fullcalendar.css';

//Api
import { getScheduleByDoctorId, getBiddingInformation } from 'apis/Schedule';

function Calendar() {

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState(0);
  const [totalMonthEvents, setTotalMonthEvents] = useState(0);
  const [leftMonthEvents, setLeftMonthEvents] = useState(0);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
    const sessionStorageData = sessionStorage.getItem('OKDOC_DOCTOR_INFO');
    if(sessionStorageData){
      const storedLoginData = JSON.parse(sessionStorageData);
      initScheduleData(sessionToken, storedLoginData)
    }
  }, []);

  const initScheduleData = async function (sessionToken, loginData) {
    try {
      const response = await getScheduleByDoctorId(loginData.id);

      let scheduleList = [];
      let todayCount = 0;
      let totalMonthCount = 0;
      let leftMonthCount = 0;

      const biddingInfoPromises = response.data.response.map((appointment) => {
        return findBiddingInformation(sessionToken, appointment.bidding_id);
      });
  
      const biddingInfos = await Promise.all(biddingInfoPromises);

      response.data.response.forEach((appointment, index) => {
        const biddingInfo = biddingInfos[index];

        scheduleList.push({
          title: `${appointment.patient.passport.user_name} / ${formatTimeFromISOString(biddingInfo.wish_at)} / ${appointment.status === 'RESERVATION_CONFIRMED' ? '예약' : '완료'}`,
          date: biddingInfo.wish_at,
          url: `/calendar/detail?id=${appointment.id}`,
        });
        if(isDateInToday(biddingInfo.wish_at)) {
          todayCount += 1;
        }
        if(isDateInThisMonth(biddingInfo.wish_at)) {
          totalMonthCount += 1;
          if(appointment.status === 'RESERVATION_CONFIRMED'){
            leftMonthCount += 1;
          }
        }
      });

      setEvents(scheduleList);
      setTodayEvents(todayCount);
      setTotalMonthEvents(totalMonthCount);
      setLeftMonthEvents(leftMonthCount);

    } catch (error) {
      if(error.status!==404){
        alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
      }
    }
  }

  const findBiddingInformation = async function (loginToken, biddingId) {
    try {
      const response = await getBiddingInformation(loginToken, biddingId);
      return response.data.response;
    } catch (error) {
      console.log(error);
    }
  }

  function formatTimeFromISOString(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }

  function isDateInToday(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return inputDate.getTime() === today.getTime();
  }

  function isDateInThisMonth(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    return inputDate.getMonth() === today.getMonth() && inputDate.getFullYear() === today.getFullYear();
  }

  return (
    <CalendarContainer>
      <Text T2 bold>원격진료 예약 현황</Text>

      <ScheduleInfoBox right={450}>
        <Text T3 bold>오늘 예약 건</Text>
        <Row marginTop={15} style={{alignItems: 'flex-start'}}>
          <Text T1 bold color={COLOR.MAIN} style={{fontSize: 40}}>{todayEvents}</Text>
          <Text T4 bold color={COLOR.MAIN} marginTop={2} marginLeft={6}>건</Text>
        </Row>
      </ScheduleInfoBox>

      <ScheduleInfoBox right={110}>
        <Text T3 bold>이번 달 남은 예약 건</Text>
        <Row marginTop={15} style={{alignItems: 'flex-start'}}>
          <Text T1 bold style={{fontSize: 40}}>{leftMonthEvents}</Text>
          <Text T4 bold color={COLOR.GRAY2} marginTop={2} marginLeft={6}>/ {totalMonthEvents} 건</Text>
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