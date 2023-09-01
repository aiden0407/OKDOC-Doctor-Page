//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, Column, FlexBox } from 'components/Flex';

//FullCalendar
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import 'design/fullcalendar.css';

//Api
import { getDoctorInfoByCredential } from 'apis/Login';
import { openSchedule, closeSchedule } from 'apis/Schedule';

function Schedule() {

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
    if(sessionToken){
      initScheduleData(sessionToken)
    }
  }, []);

  const initScheduleData = async function (loginData) {
    try {
      const response = await getDoctorInfoByCredential(loginData);
      sessionStorage.setItem('OKDOC_DOCTOR_INFO', JSON.stringify(response.data.response[0]));
      let scheduleList = [];

      // response.data.response[0].schedules.forEach((schedule) => {
      //   scheduleList.push({
      //     title: '',
      //     start: appointment.wish_at,
      //     end: addMinutesToDate(appointment.wish_at),
      //     url: `/calendar/detail?id=${appointment.id}`,
      //   });
      // });


      // const response = await getScheduleByDoctorId(loginData.id);
      // let scheduleList = [];

      // response.data.response.forEach((appointment) => {
      //   scheduleList.push({
      //     title: `• ${appointment.patient.passport.user_name} / ${formatTimeFromISOString(appointment.wish_at)} / ${appointment.status === 'RESERVATION_CONFIRMED' ? '예약' : '완료'}`,
      //     start: appointment.wish_at,
      //     end: addMinutesToDate(appointment.wish_at),
      //     url: `/calendar/detail?id=${appointment.id}`,
      //   });
      // });

      //setEvents(scheduleList);

    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  function formatTimeFromISOString(dateString) {
    const date = new Date(dateString);
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

  function isTimeSlotOverlapping(events, startTime, endTime) {
    for (const event of events) {
      const eventStartTime = new Date(event.start);
      const eventEndTime = new Date(event.end);
      if (startTime < eventEndTime && endTime > eventStartTime) {
        return true;
      }
    }
  
    return false;
  }

  const handleSelect = (info) => {
    const { start, end } = info;
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);

    if(startTime < now){
      alert('이미 지난 시간이 포함되어 있습니다.');
      return ;
    }

    const isOverlap = isTimeSlotOverlapping(events, startTime, endTime);
    if (isOverlap) {
      alert('선택하신 시간대에 이미 스케줄이 존재합니다.');
    } else {
      setEvents([
        ...events,
        {
          start,
          end
        },
      ]);
    }
  };

  const handleEventClick = (info) => {
    if(editable){
      const result = window.confirm("이 스케줄을 삭제하시겠습니까?");
      if (result) {
        const filteredEvents = events.filter(event => {
          const eventStartTime = moment(event.start);
          const targetTime = moment(info.event.startStr);
          return !eventStartTime.isSame(targetTime);
        });
        setEvents(filteredEvents);
      }
    }
  };

  const handleScheduleSave = async function () {

  }

  return (
    <ScheduleContainer>
      <Text T2 bold>의사 스케줄 관리</Text>
      <FullCalendar
        selectable={editable}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        contentHeight={650}
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'prev,next'
        }}
        events={events}
        eventClick={handleEventClick}
        select={handleSelect}
        eventColor={COLOR.SUB3}
        nowIndicator={true}
        locale="kr"
      />

      <Row marginTop={36} style={{ width: '100%', gap: 30 }}>
        <FlexBox />
        <EditButton editable={editable} onClick={() => {
          if(!editable){
            setEditable(true);
          }
        }}>
          <Text T6 medium color={editable && COLOR.GRAY2}>수정</Text>
        </EditButton>
        <SaveButton editable={editable} onClick={() => {
          if(editable){
            handleScheduleSave();
          }
        }}>
          <Text T6 medium color={editable ? '#FFFFFF' : COLOR.GRAY1}>저장</Text>
        </SaveButton>
      </Row>
    </ScheduleContainer>
  );
}

export default Schedule;

const ScheduleContainer = styled(Column)`
  width: 100%;
  padding-bottom: 150px;
`;

const EditButton = styled.div`
  width: 80px;
  padding: 15px 20px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.editable ? COLOR.GRAY3 : '#000000'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => !props.editable && 'pointer'};
`

const SaveButton = styled.div`
  width: 80px;
  padding: 15px 20px;
  background-color: ${(props) => props.editable ? COLOR.MAIN : COLOR.GRAY5};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => props.editable && 'pointer'};
`