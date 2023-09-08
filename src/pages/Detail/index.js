//React
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { saveAs } from 'file-saver';

//Components
import { COLOR, TYPOGRAPHY } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, FlexBox, Column, Box } from 'components/Flex';

//Api
import { getPatientInfoById, getHistoryListByPatientId, getHistoryStatus, getTreatmentInformation, getTreatmentResults, cancelTreatmentAppointment } from 'apis/Telemedicine';
import { getBiddingInformation } from 'apis/Schedule';

//Assets
import arrowSolidIcon from 'assets/icons/arrow_solid.svg';
import arrowIcon from 'assets/icons/arrow.svg';
import folderIcon from 'assets/icons/folder.svg';

function Calendar() {

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientId = searchParams.get('id');

  const [patientData, setPatientData] = useState({});
  const [menuStatus, setMenuStatus] = useState('');
  const [consultingList, setConsultingList] = useState([]);
  const [detailFocusStatus, setDetailFocusStatus] = useState();

  console.log(consultingList)

  useEffect(() => {
    switch (location.pathname) {
      case '/calendar/detail':
        setMenuStatus('원격진료 예약 현황');
        break;

      case '/schedule/detail':
        setMenuStatus('의사 스케줄 관리');
        break;

      default:
        break;
    }
  }, [location]);

  useEffect(() => {
    if (patientId) {
      initPatientData()
    }
  }, [location]);

  const initPatientData = async function () {
    try {
      const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
      const response = await getPatientInfoById(sessionToken, patientId);
      setPatientData(response.data.response);
      initHistoryList(patientId);
    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  const initHistoryList = async function (patientId) {
    try {
      const response = await getHistoryListByPatientId(patientId);
      const historyData = response.data.response;

      historyData.sort((a, b) => {
        const startTimeA = new Date(a.fullDocument.treatment_appointment.hospital_treatment_room.start_time);
        const startTimeB = new Date(b.fullDocument.treatment_appointment.hospital_treatment_room.start_time);
        if (startTimeA.getTime() === startTimeB.getTime()) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return startTimeB - startTimeA;
      });

      for (let ii = 0; ii < historyData.length; ii++) {
        const history = historyData[ii];

        try {
          const response = await getHistoryStatus(history.documentKey._id);
          const document = response.data.response;
          if (document[document.length - 1].operationType === 'insert') {
            history.status = 'RESERVED';
          } else {
            history.status = 'CANCELED'
          }
        } catch (error) {
          //alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
        }

        const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');

        try {
          const response = await getTreatmentInformation(sessionToken, history.fullDocument.treatment_appointment.id);
          history.appointment_data = response.data.response;
        } catch (error) {
          //console.log(error);
        }

        try {
          const response = await getBiddingInformation(sessionToken, history.fullDocument.treatment_appointment.bidding_id);
          history.bidding_data = response.data.response;
        } catch (error) {
          //console.log(error);
        }

        try {
          const response = await getTreatmentResults(sessionToken, history.fullDocument.treatment_appointment.id);
          history.treatment_data = response.data.response[0];
        } catch (error) {
          //console.log(error);
        }
      }

      setConsultingList(historyData);

    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  const handleImageDownload = (file) => {
    fetch(file.Location)
      .then((response) => {
        if (!response.ok) {
          throw new Error('파일을 다운로드할 수 없습니다.');
        }
        return response.blob();
      })
      .then((blob) => {
        // Blob을 파일로 저장
        saveAs(blob, file.key);
      })
      .catch((error) => {
        console.error('다운로드 오류:', error);
      });
  };

  const handleCancelTreatmentAppointment = async function (purchaseInformation) {
    const result = window.confirm("해당 진료를 거절하시겠습니까?");
    if (result) {
      try {
        await cancelTreatmentAppointment(purchaseInformation.id, purchaseInformation.P_TID);
        alert('해당 진료가 취소되었습니다.');
        window.location.reload();
      } catch (error) {
        alert(Array.isArray(error?.data?.message) ? error?.data?.message[0] : error?.data?.message);
      }
    }
  }

  function formatDate(inputDate) {
    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(4, 6);
    const day = inputDate.substring(6, 8);
    return `${year}.${month}.${day}`;
  }

  function enteranceTimeDisabled(startTime) {
    const targetTime = moment(startTime).add(9, 'hours').subtract(5, 'minutes');
    const currentTime = moment();
    return currentTime.isBefore(targetTime);
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <Row>
        <Text T2 bold color={COLOR.GRAY3}>{menuStatus}</Text>
        <Image src={arrowSolidIcon} width={32} marginLeft={10} />
        <Text T2 bold color={COLOR.MAIN} marginLeft={10}>진료 상세</Text>
      </Row>

      <PatientInfoContainer>
        <PatientInfoBox>
          <Text T4 bold>Personal Information</Text>
          <Row marginTop={30}>
            <ContentsTitle>
              <Text T5 bold>이름</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{patientData?.passport?.user_name}</Text>
            </ContentsText>
          </Row>
          <Row marginTop={3}>
            <ContentsTitle>
              <Text T5 bold>성별</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{patientData?.gender === 'MALE' ? '남성' : '여성'}</Text>
            </ContentsText>
          </Row>
          <Row marginTop={3}>
            <ContentsTitle>
              <Text T5 bold>생년월일</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{formatDate(String(patientData?.passport?.birth))}</Text>
            </ContentsText>
          </Row>
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>Physical Data</Text>
          <Row marginTop={30}>
            <ContentsTitle>
              <Text T5 bold>신장 / 체중</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{patientData?.height}cm / {patientData?.weight}kg</Text>
            </ContentsText>
          </Row>
          <Row marginTop={3}>
            <ContentsTitle>
              <Text T5 bold>음주 여부</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{patientData?.drinker === 'FREQUENTLY' ? '자주' : patientData?.drinker === 'SOMETIMES' ? '가끔' : '안함'}</Text>
            </ContentsText>
          </Row>
          <Row marginTop={3}>
            <ContentsTitle>
              <Text T5 bold>흡연 여부</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{patientData?.drinker === 'smoker' ? '흡연' : '비흡연'}</Text>
            </ContentsText>
          </Row>
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>본인 병력</Text>
          {
            patientData?.medical_history?.length
              ? <ContentsParagraph>{patientData?.medical_history}</ContentsParagraph>
              : <ContentsParagraph color={COLOR.GRAY3}>없음</ContentsParagraph>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>가족 병력</Text>
          {
            patientData?.family_medical_history?.length
              ? <ContentsParagraph>{patientData?.family_medical_history}</ContentsParagraph>
              : <ContentsParagraph color={COLOR.GRAY3}>없음</ContentsParagraph>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>복용 중인 약</Text>
          {
            patientData?.medication?.length
              ? <ContentsParagraph>{patientData?.medication}</ContentsParagraph>
              : <ContentsParagraph color={COLOR.GRAY3}>없음</ContentsParagraph>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>알러지 반응</Text>
          {
            patientData?.allergic_reaction?.length
              ? <ContentsParagraph>{patientData?.allergic_reaction}</ContentsParagraph>
              : <ContentsParagraph color={COLOR.GRAY3}>없음</ContentsParagraph>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>기타 사항</Text>
          {
            patientData?.consideration?.length
              ? <ContentsParagraph>{patientData?.consideration}</ContentsParagraph>
              : <ContentsParagraph color={COLOR.GRAY3}>없음</ContentsParagraph>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>Extra Information</Text>
          <ContentsParagraph color={COLOR.GRAY3}>없음</ContentsParagraph>
        </PatientInfoBox>
      </PatientInfoContainer>

      <Text T2 bold marginTop={54}>Consulting</Text>

      <ConsultingHeader>
        <ConsultingSection1>

        </ConsultingSection1>
        <ConsultingSection2>
          <Text T5 bold>진료과 / 진료의</Text>
        </ConsultingSection2>
        <ConsultingSection2>
          <Text T5 bold>일시</Text>
        </ConsultingSection2>
        <ConsultingSection2>
          <Text T5 bold>상태</Text>
        </ConsultingSection2>
        <ConsultingSection3>
          <Text T5 bold>진단명</Text>
        </ConsultingSection3>
        <ConsultingSection3>

        </ConsultingSection3>
      </ConsultingHeader>

      {
        consultingList?.map((item, index) => {
          return (
            <div key={`consulting_${index}`}>
              <ConsultingLine onClick={() => {
                if (detailFocusStatus === index) {
                  setDetailFocusStatus();
                } else {
                  setDetailFocusStatus(index);
                }
              }}>
                <ConsultingSection1>
                  {
                    item.status === "RESERVED" && <Image src={arrowIcon} width={24} />
                  }
                </ConsultingSection1>
                <ConsultingSection2>
                  <Text T5>{item.fullDocument.treatment_appointment.doctor.department} / {item.fullDocument.treatment_appointment.doctor.name} 님</Text>
                </ConsultingSection2>
                <ConsultingSection2>
                  <Text T5>{moment(item.fullDocument.treatment_appointment.hospital_treatment_room.start_time).add(9, 'hours').format('YYYY-MM-DD HH:mm')}</Text>
                </ConsultingSection2>
                <ConsultingSection2>
                  <Text T5>{item.status === "RESERVED" ? item.appointment_data?.status === "RESERVATION_CONFIRMED" ? '예약(진료 대기)' : '진료 완료' : '예약 취소'}</Text>
                </ConsultingSection2>
                <ConsultingSection3>
                  {
                    item.status === "RESERVED" && item?.appointment_data?.status !== "RESERVATION_CONFIRMED" && <Text T5>{item?.treatment_data?.disease?.한글명}</Text>
                  }
                </ConsultingSection3>
                <ConsultingSection3 style={{justifyContent: 'flex-start'}}>
                  {(item.status === "RESERVED" && (item.appointment_data?.status === "RESERVATION_CONFIRMED" || !item?.treatment_data))
                    && <Row>
                      <ConsultingButton disabled={enteranceTimeDisabled(item.fullDocument.treatment_appointment.hospital_treatment_room.start_time)} onClick={(e) => {
                        e.stopPropagation();
                        //if (!enteranceTimeDisabled(item.fullDocument.treatment_appointment.hospital_treatment_room.start_time)) {
                          navigate(`/telemedicine?id=${item.fullDocument.treatment_appointment.id}`);
                        //}
                      }}>
                        <Text T6 color={enteranceTimeDisabled(item.fullDocument.treatment_appointment.hospital_treatment_room.start_time) ? COLOR.GRAY2 : "#106DF9"}>{item.appointment_data?.status === "RESERVATION_CONFIRMED" ? '진료실 입장' : '소견서 작성'}</Text>
                      </ConsultingButton>
                      {
                        item.appointment_data?.status === "RESERVATION_CONFIRMED" && <ConsultingButton onClick={(e)=>{
                          e.stopPropagation();
                          handleCancelTreatmentAppointment(item.fullDocument);
                        }}>
                          <Text T6 color="#106DF9">진료 취소 요청</Text>
                        </ConsultingButton>
                      }
                    </Row>
                  }
                </ConsultingSection3>
              </ConsultingLine>
              <ConsultingDetail className={(item.status === "RESERVED" && detailFocusStatus === index) && 'open'}>
                <Box height={20} />
                <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Column style={{ width: '35%' }}>
                    <StyledRow>
                      <Text T5 bold color={COLOR.MAIN}>Patient Conditions</Text>
                      <FlexBox />
                      {
                        item?.bidding_data?.attachments?.[0] && <Image src={folderIcon} width={25} style={{ cursor: 'pointer' }} onClick={() => handleImageDownload(item?.bidding_data?.attachments[0])} />
                      }
                    </StyledRow>
                    <ConsultingInput1
                      readOnly
                      value={item?.bidding_data?.explain_symptom}
                    />
                  </Column>

                  <Column style={{ width: '60%' }}>
                    <Text T5 bold color={COLOR.MAIN}>Doctor MD note</Text>
                    <StyledRow marginTop={18}>
                      <ConsultingTitle>
                        <Text T6>C.C</Text>
                      </ConsultingTitle>
                      <ConsultingInput2
                        readOnly
                        value={item?.treatment_data?.chief_complaint}
                      />
                    </StyledRow>

                    <StyledRow marginTop={18}>
                      <ConsultingTitle>
                        <Text T6>Subjective Symtoms</Text>
                      </ConsultingTitle>
                      <ConsultingInput3
                        readOnly
                        value={item?.treatment_data?.subjective_symptom}
                      />
                      <ConsultingTitle marginLeft={20}>
                        <Text T6>Assessment</Text>
                      </ConsultingTitle>
                      <ConsultingInput3
                        readOnly
                        value={item?.treatment_data?.assessment}
                      />
                    </StyledRow>

                    <StyledRow marginTop={18}>
                      <ConsultingTitle>
                        <Text T6>Objective Findings</Text>
                      </ConsultingTitle>
                      <ConsultingInput3
                        readOnly
                        value={item?.treatment_data?.objective_finding}
                      />
                      <ConsultingTitle marginLeft={20}>
                        <Text T6>Plan</Text>
                      </ConsultingTitle>
                      <ConsultingInput3
                        readOnly
                        value={item?.treatment_data?.plan}
                      />
                    </StyledRow>

                    <StyledRow marginTop={18}>
                      <Column style={{ flex: 1 }}>
                        <StyledRow>
                          <ConsultingTitle>
                            <Text T6>Diagnosis</Text>
                          </ConsultingTitle>
                          <ConsultingInput2
                            readOnly
                            value={item?.treatment_data?.disease?.한글명}
                          />
                        </StyledRow>
                        <StyledRow marginTop={3}>
                          <Column style={{ width: 90 }}>
                            <Row gap={4}>
                              <RadioButton
                                readOnly
                                type="radio"
                                value="임상적 추정"
                                checked={item?.treatment_data?.diagnosis_type === "presumptive"}
                              />
                              <Text T6>임상적 추정</Text>
                            </Row>
                            <Row gap={4}>
                              <RadioButton
                                readOnly
                                type="radio"
                                value="최종 진단"
                                checked={item?.treatment_data?.diagnosis_type === "definitive"}
                              />
                              <Text T6>최종 진단</Text>
                            </Row>
                          </Column>
                          <ConsultingInput2
                            marginTop={6}
                            readOnly
                            value={item?.treatment_data?.disease?.상병기호}
                          />
                        </StyledRow>
                      </Column>
                      <Row marginLeft={20} style={{ flex: 1 }}>
                        <ConsultingTitle>
                          <Text T6>Medical Opinion</Text>
                        </ConsultingTitle>
                        <ConsultingInput3
                          readOnly
                          value={item?.treatment_data?.medical_opinion}
                        />
                      </Row>
                    </StyledRow>
                  </Column>
                </Row>
                <Box height={20} />
              </ConsultingDetail>
            </div>
          )
        })
      }
    </div>
  );
}

export default Calendar;

const PatientInfoContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  row-gap: 50px;
  column-gap: 36px;
`

const PatientInfoBox = styled.div`
  width: 410px;
  height: 190px;
  padding: 10px 20px;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0px 20px 40px 0px rgba(134, 142, 150, 0.10);
  display: flex;
  flex-direction: column;
`

const ContentsTitle = styled.div`
  width: 130px;
  height: 34px;
  padding: 5px 0;
`

const ContentsText = styled.div`
  margin-left: 20px;
  width: 70%;
  height: 34px;
  padding: 5px 0px;
`

const ContentsParagraph = styled.p`
  margin-top: 30px;
  width: 100%;
  height: 95px;
  font-size: ${TYPOGRAPHY.T5.SIZE};
  line-height: ${TYPOGRAPHY.T5.LEADING};
  font-weight: 500;
  color: ${(props) => props.color ?? '#000000'};
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const ConsultingHeader = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 60px;
  background-color: ${COLOR.SUB3};
  display: flex;
`

const ConsultingSection1 = styled.div`
  width: 24px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ConsultingSection2 = styled.div`
  width: 16%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ConsultingSection3 = styled.div`
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ConsultingLine = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  background-color: #FFFFFF;
  border-bottom: 1px solid ${COLOR.GRAY5};
  cursor: pointer;
`

const ConsultingDetail = styled.div`
  max-height: 0px;
  padding: 0px 60px;
  background-color: ${COLOR.GRAY6};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  &.open {
    max-height: 1000px;
  }
`;

const ConsultingInput1 = styled.textarea`
  margin-top: 18px;
  width: 100%;
  height: 310px;
  padding: 11px 9px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY5};
  font-size: 12px;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const ConsultingTitle = styled.div`
  margin-left: ${(props) => `${props.marginLeft}px`};
  width: 90px;
`

const ConsultingInput2 = styled.textarea`
  margin-top: ${(props) => `${props.marginTop}px`};
  height: 30px;
  padding: 5px 11px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY5};
  font-size: 12px;
  display: flex;
  flex: 1;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const ConsultingInput3 = styled.textarea`
  height: 75px;
  padding: 5px 11px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY5};
  font-size: 12px;
  display: flex;
  flex: 1;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const ConsultingButton = styled.div`
  margin-right: 25px;
  padding: 5px 10px;
  border-radius: 5px;
  background: ${(props) => props.disabled ? COLOR.GRAY5 : '#E8F1FF'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => props.disabled ? 'default' : 'pointer'};
`

const StyledRow = styled(Row)`
  width: 100%;
`

const RadioButton = styled.input`
  margin: 0px;
`