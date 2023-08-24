//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, FlexBox, DividingLine } from 'components/Flex';

//FullCalendar
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import 'design/fullcalendar.css';

//Api
import { getScheduleByDoctorId } from 'apis/Schedule';

function Calendar() {

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const sessionStorageData = sessionStorage.getItem('OKDOC_DOCTOR');
    if(sessionStorageData){
      const storedLoginData = JSON.parse(sessionStorageData);
      initScheduleData(storedLoginData)
    }
  }, []);

  const initScheduleData = async function (loginData) {
    try {
      const response = await getScheduleByDoctorId(loginData.id);
      let scheduleList = [];

      response.data.response.forEach((appointment) => {
        scheduleList.push({
          title: `• ${appointment.patient.passport.user_name} / ${formatTimeFromISOString(appointment.wish_at)} / ${appointment.status === 'RESERVATION_CONFIRMED' ? '예약' : '완료'}`,
          start: appointment.wish_at,
          end: addMinutesToDate(appointment.wish_at),
          url: `/calendar/detail?id=${appointment.id}`,
        });
      });

      scheduleList.push({
        title: `• 이준범 / ${formatTimeFromISOString("2023-08-22T16:00:00.000Z")} / 예약`,
        start: "2023-08-22T16:00:00.000Z",
        end: addMinutesToDate("2023-08-22T16:00:00.000Z"),
        url: `/calendar/detail?id=${1234}`,
      });

      setEvents(scheduleList);

    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  function formatTimeFromISOString(dateString) {
    const date = new Date(dateString);
    console.log(date);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }

  function addMinutesToDate(dateString) {
    const inputDate = new Date(dateString);
    const newDate = new Date(inputDate.getTime() + 20 * 60 * 1000);
    return newDate.toISOString();
  }

  const handleSelect = (info) => {
    const { start, end } = info;
    setEvents([
      ...events,
      {
        start,
        end
      },
    ]);

  };

  return (
    <>
      <Text T2 bold>진료 스케줄 관리</Text>
      <FullCalendar
        selectable
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        contentHeight={650}
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'prev,next'
        }}
        events={events}

        select={handleSelect}




        eventColor={COLOR.SUB3}
        nowIndicator={true}
        locale="kr"
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