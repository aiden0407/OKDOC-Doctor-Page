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
import { Row, FlexBox, DividingLine } from 'components/Flex';

//Api
import { getTreatmentInformation, getTreatmentByPatientId, getTreatmentResults } from 'apis/Telemedicine';
import { getBiddingInformation } from 'apis/Schedule';

//Assets
import folderIcon from 'assets/icons/folder.svg';

function Telemedicine() {

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const treatmentId = searchParams.get('id');

  const [treatmentData, setTreatmentData] = useState();
  const [consultingData, setConsultingData] = useState([]);

  useEffect(() => {
    if (treatmentId) {
      initData();
    }
  }, [location]);

  const initData = async function () {
    try {
      const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
      const response = await getTreatmentInformation(sessionToken, treatmentId);
      const treatmentInformation = response.data.response;

      try {
        const biddingResponse = await getBiddingInformation(sessionToken, treatmentInformation.bidding_id);
        treatmentInformation.biddingData = biddingResponse.data.response;
        setTreatmentData(treatmentInformation);
      } catch (error) {
        alert('네트워크 오류로 인해 진료 정보를 불러오지 못했습니다.');
      }

      try {
        const historyResponse = await getTreatmentByPatientId(sessionToken, treatmentInformation.patient.id);
        const treatmentHistory = historyResponse.data.response;

        for (let ii = 0; ii < treatmentHistory.length; ii++) {
          if(treatmentHistory[ii].status !== 'RESERVATION_CONFIRMED'){
            try {
              const treatmentResponse = await getTreatmentResults(sessionToken, treatmentHistory[ii].id);
              treatmentHistory[ii].treatmentData = treatmentResponse.data.response[0];
            } catch (error) {
              alert('네트워크 오류로 인해 이전 진료 정보를 불러오지 못했습니다.');
            }
          }
        }

        setConsultingData(treatmentHistory);
      } catch (error) {
        alert('네트워크 오류로 인해 진료 내역을 불러오지 못했습니다.');
      }

    } catch (error) {
      alert('네트워크 오류로 인해 환자 정보를 불러오지 못했습니다.');
    }
  }

  function formatDate(inputDate) {
    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(4, 6);
    const day = inputDate.substring(6, 8);
    return `${year}.${month}.${day}`;
  }

  const handleImageDownload = (file) => {
    console.log(file)
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



  console.log(treatmentData);
  console.log(consultingData);

  return (
    <TelemedicineContainer>
      <TelemedicineSector1>
        <TelemedicineTitleBox>
          <Text T6 bold color="#565965">진료 예약 일자</Text>
          <Text T6 color="#565965">{moment(treatmentData?.hospital_treatment_room?.start_time).add(9, 'hours').format('YYYY-MM-DD, HH:mm')}</Text>
          <Text T6 bold color="#565965">진료 종료 예정 시간</Text>
          <Text T6 color="#565965">{moment(treatmentData?.hospital_treatment_room?.start_time).add(9, 'hours').format('HH:mm')} ~ {moment(treatmentData?.hospital_treatment_room?.start_time).add(9, 'hours').add(10, 'minutes').format('HH:mm')}</Text>
          <TelemedicineClock>
            <Text T6 color="#565965">00:00</Text>
          </TelemedicineClock>
        </TelemedicineTitleBox>

        <Iframe src={`https://zoom.okdoc.app/meeting/doctor/?meetingNumber=${treatmentData?.hospital_treatment_room?.id}&userName=${treatmentData?.doctor?.name} 의사&wishAt=${treatmentData?.biddingData?.wish_at}`} allow="camera; microphone" />
      </TelemedicineSector1>

      <TelemedicineSector2>
        <InfoBox33>
          <Text T4 bold>Personal Information</Text>
          <Row marginTop={10}>
            <ContentsTitle>
              <Text T5 bold>이름</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.passport?.user_name}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>성별</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.gender === 'MALE' ? '남성' : '여성'}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>생년월일</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{formatDate(String(treatmentData?.patient?.passport?.birth))}</Text>
            </ContentsText>
          </Row>
        </InfoBox33>
        <InfoBox33>
          <Text T4 bold>Present Conditions</Text>
          <Text T5 marginTop={4}>{treatmentData?.biddingData?.explain_symptom}</Text>
        </InfoBox33>
        <InfoBox10>
          <Text T4 bold>Files</Text>
          {
            treatmentData?.biddingData?.attachments[0]
            ?<Image src={folderIcon} width={25} style={{ cursor: 'pointer' }} onClick={() => {
              handleImageDownload(treatmentData.biddingData.attachments[0])
            }} />
            :<Text T6 color={COLOR.GRAY0}>첨부 파일 없음</Text>
          }
        </InfoBox10>
        <InfoBox33>
          <Text T4 bold>Consulting</Text>
          {
            consultingData.map((item, index) => {
              if(item?.treatmentData){
                return (
                  <Text T5 marginTop={3} key={index}>· {moment(item?.hospital_treatment_room?.start_time).add(9, 'hours').format('YY-MM-DD')} / {item?.doctor?.department} / {item?.treatmentData?.disease?.한글명}</Text>
                )
              }
            })
          }
        </InfoBox33>
        <InfoBox61>
        <Text T4 bold>Personal Information</Text>
          <Row marginTop={10}>
            <ContentsTitle>
              <Text T5 bold>신장 / 체중</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.height}cm / {treatmentData?.patient?.weight}kg</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>음주 여부</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.drinker === 'FREQUENTLY' ? '자주' : treatmentData?.patient?.drinker === 'SOMETIMES' ? '가끔' : '안함'}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>흡연 여부</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.drinker === 'smoker' ? '흡연' : '비흡연'}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>본인 병력</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.medical_history?.length ? treatmentData?.patient?.medical_history : '없음'}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>가족 병력</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.family_medical_history?.length ? treatmentData?.patient?.family_medical_history : '없음'}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>복용 중인 약</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.medication?.length ? treatmentData?.patient?.medication : '없음'}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>알러지 반응</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.allergic_reaction?.length ? treatmentData?.patient?.allergic_reaction : '없음'}</Text>
            </ContentsText>
          </Row>
          <Row>
            <ContentsTitle>
              <Text T5 bold>기타 사항</Text>
            </ContentsTitle>
            <ContentsText>
              <Text T5 medium>{treatmentData?.patient?.consideration?.length ? treatmentData?.patient?.consideration : '없음'}</Text>
            </ContentsText>
          </Row>
        </InfoBox61>
      </TelemedicineSector2>

      <TelemedicineSector2>
        <MDBox>

        </MDBox>
        asdfasd
      </TelemedicineSector2>
    </TelemedicineContainer>
  );
}

export default Telemedicine;

const TelemedicineContainer = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 30px;
  display: flex;
  gap: 14px;
`

const TelemedicineSector1 = styled.div`
  height: 100%;
  display: flex;
  flex: 1.7;
  flex-direction: column;
  gap: 14px;
`

const TelemedicineSector2 = styled.div`
height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
`

const TelemedicineTitleBox = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  background: ${COLOR.SUB3};
  justify-content: space-between;
  align-items: center;
`

const TelemedicineClock = styled.div`
  padding: 8px 18px;
  border-radius: 5px;
  border: 1px solid #000000;
  background: #FFFFFF;
`

const Iframe = styled.iframe`
  margin-top: 24px;
  width: 100%;
  height: 100%;
  border: none;
  border: 1px solid #000000;
  border-radius: 12px;
  background: #030303;
`

const InfoBox61 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 6.1;
  padding: 10px 2px 10px 20px;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0px 20px 40px 0px rgba(134, 142, 150, 0.10);
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
`

const InfoBox33 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 3.3;
  padding: 10px 2px 10px 20px;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0px 20px 40px 0px rgba(134, 142, 150, 0.10);
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
`

const InfoBox10 = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 10px 25px 10px 20px;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0px 20px 40px 0px rgba(134, 142, 150, 0.10);
`

const MDBox = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0px 20px 40px 0px rgba(134, 142, 150, 0.10);
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