//React
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Row, Column, FlexBox } from 'components/Flex';

//FullCalendar
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import 'design/fullcalendar.css';

//Api
import { getDoctorInfoByCredential } from 'apis/Login';
import { openSchedule, deleteAllSchedule } from 'apis/Schedule';

function Schedule() {

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

      const schedules = response.data.response[0].schedules;
      const mergedAndAdjustedResult = mergeAndAdjustTimeSlots(schedules);
      setEvents(mergedAndAdjustedResult);
    } catch (error) {
      //alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  function mergeAndAdjustTimeSlots(schedules) {
    // 병합되지 않은 결과 배열 초기화
    const mergedResult = [];
  
    // 데이터를 시간별로 정렬
    const sortedSchedules = schedules.sort((a, b) => {
      return new Date(a.open_at) - new Date(b.open_at);
    });
  
    // 초기 슬롯 설정
    let currentSlot = {
      start: sortedSchedules[0].open_at,
      end: sortedSchedules[0].close_at,
    };
  
    // 데이터를 반복하면서 병합 및 시간 조정 수행
    for (let i = 1; i < sortedSchedules.length; i++) {
      const currentSchedule = sortedSchedules[i];
  
      // 현재 슬롯과 현재 스케줄이 겹치면 시간 확장
      if (new Date(currentSchedule.open_at) <= new Date(currentSlot.end)) {
        currentSlot.end = currentSchedule.close_at;
      } else {
        // 겹치지 않으면 현재 슬롯을 결과 배열에 추가하고 새로운 슬롯 시작
        mergedResult.push({ ...currentSlot });
        currentSlot = {
          start: currentSchedule.open_at,
          end: currentSchedule.close_at,
        };
      }
    }
  
    // 마지막 슬롯을 결과 배열에 추가
    mergedResult.push({ ...currentSlot });
  
    // 시작 시간과 종료 시간 조정
    const adjustedResult = mergedResult.map(slot => {
      if (slot.start.endsWith('40:00.000Z')) {
        slot.start = slot.start.replace('40:00.000Z', '30:00.000Z');
      }
      if (slot.end.endsWith('20:00.000Z')) {
        slot.end = slot.end.replace('20:00.000Z', '30:00.000Z');
      }
      return slot;
    });
  
    return adjustedResult;
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
      const targetTime = moment(info.event.startStr);
      const currentTime = moment();
      if(targetTime.isBefore(currentTime)){
        alert('이미 지난 시간은 삭제할 수 없습니다.');
        return ;
      }

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

  function splitEventsIntoTimeSlots(events) {
    // 병합되지 않은 결과 배열 초기화
    const mergedResult = [];

    // 데이터를 시간별로 정렬
    const sortedSchedules = events.sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });

    // 초기 슬롯 설정
    let currentSlot = {
      start: sortedSchedules[0].start,
      end: sortedSchedules[0].end,
    };

    // 데이터를 반복하면서 병합 및 시간 조정 수행
    for (let i = 1; i < sortedSchedules.length; i++) {
      const currentSchedule = sortedSchedules[i];

      // 현재 슬롯과 현재 스케줄이 겹치면 시간 확장
      if (new Date(currentSchedule.start) <= new Date(currentSlot.end)) {
        currentSlot.end = currentSchedule.end;
      } else {
        // 겹치지 않으면 현재 슬롯을 결과 배열에 추가하고 새로운 슬롯 시작
        mergedResult.push({ ...currentSlot });
        currentSlot = {
          start: currentSchedule.start,
          end: currentSchedule.end,
        };
      }
    }

    // 마지막 슬롯을 결과 배열에 추가
    mergedResult.push({ ...currentSlot });

    const result = [];

    mergedResult.forEach(event => {
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);
  
      // 이벤트의 start가 30분이면 40분에 시작하도록 조정합니다.
      if (startTime.getMinutes() === 30) {
        startTime.setMinutes(40);
      }
  
      // 이벤트의 end가 30분이면 20분에 끝나도록 조정합니다.
      if (endTime.getMinutes() === 30) {
        endTime.setMinutes(20);
      }
  
      // 정각부터 시작하여 20분 단위로 이벤트를 생성합니다.
      while (startTime < endTime) {
        const slotEndTime = new Date(startTime);
        slotEndTime.setMinutes(startTime.getMinutes() + 20);
  
        // 다음 20분 슬롯을 생성합니다.
        result.push({
          open_at: startTime.toISOString(),
          close_at: slotEndTime.toISOString()
        });
  
        // 다음 슬롯을 위해 20분을 더해줍니다.
        startTime.setMinutes(startTime.getMinutes() + 20);
      }
    });
  
    return result;
  }

  const handleScheduleSave = async function () {

    const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
    const sessionStorageData = sessionStorage.getItem('OKDOC_DOCTOR_INFO');
    const storedLoginData = JSON.parse(sessionStorageData);
    const result = splitEventsIntoTimeSlots(events);

    try {
      await deleteAllSchedule(sessionToken, storedLoginData.id);

      for (let ii = 0; ii < result.length; ii++) {
        try {
          await openSchedule(sessionToken, storedLoginData.id, result[ii]);
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
      return ;
    }

    alert('스케줄이 저장되었습니다.');
    window.location.reload();
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
        eventColor={COLOR.SUB2}
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