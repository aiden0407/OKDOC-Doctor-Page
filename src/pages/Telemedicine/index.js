//React
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { saveAs } from 'file-saver';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, Column } from 'components/Flex';

//Api
import { getTreatmentInformation, getTreatmentByPatientId, getTreatmentResults, submitTreatment, findDeases } from 'apis/Telemedicine';
import { getBiddingInformation } from 'apis/Schedule';

//Assets
import folderIcon from 'assets/icons/folder.svg';

//react-pdf
import { Page, Text as PdfText, View, Font, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

function Telemedicine() {

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const treatmentId = searchParams.get('id');

  const [treatmentData, setTreatmentData] = useState();
  const [consultingData, setConsultingData] = useState([]);
  const [isDiagnosisOpend, setIsDiagnosisOpend] = useState(false);

  const [CC, setCC] = useState('');
  const [subjectiveSymtoms, setSubjectiveSymtoms] = useState('');
  const [objectiveFindings, setObjectiveFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [diagnosisType, setDiagnosisType] = useState();
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [diagnosisId, setDiagnosisId] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [medicalOpinion, setMedicalOpinion] = useState('');

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

  const handleTextChange = async (e) => {
    const searchText = e.target.value;
    setDiagnosis(searchText); 
    if(searchText){
      try {
        const response = await findDeases(searchText);
        setDiagnosisCode(response.data.response?.[0]?.상병기호)
        setDiagnosisId(response.data.response?.[0]?._id);
      } catch {
        setDiagnosisCode('');
        setDiagnosisId();
      }
    } else {
      setDiagnosisCode('');
      setDiagnosisId();
    }
  };

  const handleTreatmentSubmit = async function () {
    if (!CC.length || !subjectiveSymtoms.length || !subjectiveSymtoms.length || !objectiveFindings.length || !diagnosisCode.length || !diagnosisType.length || !assessment.length || !plan.length || !medicalOpinion.length) {
      alert('MD 노트에 작성하지 않은 필드가 존재합니다.');
      return;
    }

    const result = window.confirm("진단서를 제출하시겠습니까?\n제출하면 다시 수정할 수 없습니다.");
    if (result) {
      const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
      const data = {
        "chief_complaint": CC,
        "subjective_symptom": subjectiveSymtoms,
        "objective_finding": objectiveFindings,
        "disease_id": diagnosisId,
        "diagnosis_type": diagnosisType,
        "assessment": assessment,
        "plan": plan,
        "medical_opinion": medicalOpinion
      }

      try {
        await submitTreatment(sessionToken, treatmentData.id, data);
        navigate(`/calendar/detail?id=${treatmentData.patient.id}`)
      } catch (error) {
        alert('네트워크 오류로 인해 환자 정보를 불러오지 못했습니다.');
      }
    }
  }

  function returnToday() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줍니다.
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  }

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfText style={styles.main}>소견서</PdfText>

        <View style={styles.row1}>
          <View style={styles.titleBox1}>
            <PdfText style={styles.title}>환자의 성명</PdfText>
          </View>
          <View style={styles.contentBox1}>
            <PdfText style={styles.content}>{treatmentData?.patient?.passport?.user_name}</PdfText>
          </View>
          <View style={styles.titleBox1}>
            <PdfText style={styles.title}>환자 생년월일</PdfText>
          </View>
          <View style={styles.contentBox1}>
            <PdfText style={styles.content}>{formatDate(String(treatmentData?.patient?.passport?.birth))}</PdfText>
          </View>
        </View>

        <View style={styles.row2}>
          <View style={styles.titleBox2}>
            <PdfText style={styles.title}>병명</PdfText>
            <View style={styles.column1}>
              <PdfText style={styles.content}>{diagnosisType === 'presumptive' ? '◉ 임상적 추정' : '○ 임상적 추정'}</PdfText>
              <PdfText style={styles.content}>{diagnosisType === 'definitive' ? '◉ 최종 진단' : '○ 최종 진단'}</PdfText>
            </View>
          </View>
          <View style={styles.contentBox2}>
            <PdfText style={styles.content}>{diagnosis}</PdfText>
          </View>
          <View style={styles.titleBox2}>
            <PdfText style={styles.title}>질병 분류 기호</PdfText>
          </View>
          <View style={styles.contentBox2}>
            <PdfText style={styles.content}>{diagnosisCode}</PdfText>
          </View>
        </View>

        <View style={styles.row2}>
          <View style={styles.titleBox3}>
            <PdfText style={styles.title}>진료 내용 및{'\n'}향후 치료에 대한{'\n'}소견</PdfText>
          </View>
          <View style={styles.contentBox3}>
            <View style={styles.column2}>
              <PdfText style={styles.title}>(환자 호소 증상)</PdfText>
              <PdfText style={styles.content}>{CC}</PdfText>
              <PdfText style={styles.content}>{subjectiveSymtoms}</PdfText>
            </View>
            
            <View style={styles.column2}>
              <PdfText style={styles.title}>(본 의사의 판단)</PdfText>
              <PdfText style={styles.content}>{objectiveFindings}</PdfText>
              <PdfText style={styles.content}>{assessment}</PdfText>
            </View>
            
            <View style={styles.column2}>
              <PdfText style={styles.title}>(치료 계획)</PdfText>
              <PdfText style={styles.content}>{plan}</PdfText>
            </View>
            
            <View style={styles.column2}>
              <PdfText style={styles.title}>(본 의사의 판단)</PdfText>
              <PdfText style={styles.content}>{medicalOpinion}</PdfText>
            </View>
          </View>
        </View>

        <View style={styles.contentBox4}>
          <PdfText style={styles.content}>상기 진료는 ㈜인성정보의 OK DOC 플랫폼을 통한 원격진료로 진행되었으며, 위와 같이 소견합니다.</PdfText>
          <View style={styles.row3}>
            <PdfText style={styles.content}>{returnToday()}</PdfText>
          </View>
          <View style={styles.row4}>
            <PdfText style={styles.content}>의료기관 명칭 : 의정부을지대학교병원</PdfText>
            <PdfText style={styles.content}> </PdfText>
            <PdfText style={styles.content}>주소 : 경기도 의정부시 동일로 712 (금오동)</PdfText>
            <PdfText style={styles.content}> </PdfText>
            <PdfText style={styles.content}> </PdfText>
            <PdfText style={styles.content}> </PdfText>
            <PdfText style={styles.content}>[○]의사 [ ]치과의사 [ ]한의사 면허번호 : 제 {treatmentData?.doctor?.id} 호</PdfText>
            {/* <PdfText style={styles.content}>[○]의사 [&nbsp;&nbsp;]치과의사 [&nbsp;&nbsp;]한의사 면허번호 : 제 82595 호</PdfText> */}
            <PdfText style={styles.content}> </PdfText>
            <PdfText style={styles.content}>성명:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{treatmentData?.doctor?.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(서명)</PdfText>
            {/* <PdfText style={styles.content}>성명:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;임수빈&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(서명)</PdfText> */}
          </View>
        </View>

        
      </Page>
    </Document>
  );

  Font.register({ family: "Nanum Gothic Regular", src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf", });
  Font.register({ family: "Nanum Gothic Bold", src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf", });

  const styles = StyleSheet.create({
    viewer: {
      position: 'absolute',
      width: '40%',
      height: '80%',
      top: 0,
      right: 0
    },
    page: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '25px 40px',
      fontFamily: 'Nanum Gothic Regular'
    },
    main: {
      fontFamily: 'Nanum Gothic Bold',
      fontSize: 20
    },
    title: {
      fontFamily: 'Nanum Gothic Bold',
      fontSize: 11,
      textAlign: 'center'
    },
    content: {
      fontSize: 11
    },
    row1: {
      marginTop: 30,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    titleBox1: {
      minWidth: 80,
      height: 24,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #7A7A7A',
      backgroundColor: '#F0F0F0',
    },
    contentBox1: {
      width: '100%',
      height: 24,
      padding: '0 0 0 10px',
      display: 'flex',
      justifyContent: 'center',
      border: '1px solid #7A7A7A',
    },
    row2: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    column1: {
      marginTop: 4,
      marginLeft: 8,
      width: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 4
    },
    titleBox2: {
      minWidth: 80,
      height: 75,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #7A7A7A',
      backgroundColor: '#F0F0F0',
    },
    contentBox2: {
      width: '100%',
      height: 75,
      padding: '0 0 0 10px',
      display: 'flex',
      justifyContent: 'center',
      border: '1px solid #7A7A7A',
    },
    titleBox3: {
      minWidth: 80,
      height: 460,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #7A7A7A',
      backgroundColor: '#F0F0F0',
    },
    contentBox3: {
      width: '100%',
      height: 460,
      padding: '10px 0 60px 10px',
      display: 'flex',
      border: '1px solid #7A7A7A',
      justifyContent: 'space-between',
    },
    column2: {
      width: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 4
    },
    contentBox4: {
      width: '100%',
      height: 170,
      padding: '10px 30px 30px 10px',
      display: 'flex',
      border: '1px solid #7A7A7A',
    },
    row3: {
      marginTop: 10,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    row4: {
      padding: '30px 0 0 30px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
  });

  return (
    <TelemedicineContainer>
      {
        isDiagnosisOpend && <PDFViewer style={styles.viewer}>
          <MyDocument />
        </PDFViewer>
      }

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
        {/* <Iframe src={`http://127.0.0.1:5500/meeting/doctor/?meetingNumber=${treatmentData?.hospital_treatment_room?.id}&userName=${treatmentData?.doctor?.name} 의사&wishAt=${treatmentData?.biddingData?.wish_at}`} allow="camera; microphone" /> */}
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
          <Text T4 bold>Doctor MD note</Text>

          <Section marginTop={11}>
            <Title>
              <Text T6 bold>C.C</Text>
            </Title>
            <InputWrapper>
              <TextInput
                placeholder="환자 주요 호소 증상을 입력 해주세요."
                value={CC}
                onChange={(event) => {
                  setCC(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
          <Section>
            <Title>
              <Text T6 bold>Subjective{'\n'}Symtoms</Text>
            </Title>
            <InputWrapper>
              <TextArea
                placeholder="주관적 환자 호소 증상을  입력 해주세요."
                value={subjectiveSymtoms}
                onChange={(event) => {
                  setSubjectiveSymtoms(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
          <Section>
            <Title>
              <Text T6 bold>Objective{'\n'}Findings</Text>
            </Title>
            <InputWrapper>
              <TextArea
                placeholder="객관적 의사 판단 증상을  입력 해주세요."
                value={objectiveFindings}
                onChange={(event) => {
                  setObjectiveFindings(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
          <Section>
            <Title>
              <Text T6 bold>Diagnosis</Text>
              <Column marginTop={6}>
                <Row gap={4}>
                  <RadioButton
                    type="radio"
                    value="임상적 추정"
                    checked={diagnosisType === "presumptive"}
                    onChange={() => {
                      setDiagnosisType("presumptive");
                    }}
                  />
                  <Text T7>임상적 추정</Text>
                </Row>
                <Row gap={4}>
                  <RadioButton
                    type="radio"
                    value="최종 진단"
                    checked={diagnosisType === "definitive"}
                    onChange={() => {
                      setDiagnosisType("definitive");
                    }}
                  />
                  <Text T7>최종 진단</Text>
                </Row>
              </Column>
            </Title>
            <InputWrapper>
              <TextInput
                placeholder="진단을 입력 해주세요. (복수일 경우 ,로 구분)"
                value={diagnosis}
                onChange={handleTextChange}
              />
              <TextInput
                readOnly
                placeholder="질병코드 자동 생성"
                value={diagnosisCode}
                style={{marginTop: 4}}
              />
            </InputWrapper>
          </Section>
          <Section>
            <Title>
              <Text T6 bold>Assessment</Text>
            </Title>
            <InputWrapper>
              <TextArea
                placeholder="환자 질환에 대한 Assessment를 작성 해주세요."
                value={assessment}
                onChange={(event) => {
                  setAssessment(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
          <Section>
            <Title>
              <Text T6 bold>Plan</Text>
            </Title>
            <InputWrapper>
              <TextArea
                placeholder="환자의 질환에 대한 치료 계획을 입력 해주세요."
                value={plan}
                onChange={(event) => {
                  setPlan(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
          <Section>
            <Title>
              <Text T6 bold>Medical{'\n'}Opinion</Text>
            </Title>
            <InputWrapper>
              <TextArea
                placeholder="진료에 대한 최종 소견을 작성 해주세요."
                value={medicalOpinion}
                onChange={(event) => {
                  setMedicalOpinion(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
        </MDBox>

        <Row gap={10}>
          <LineButton onClick={()=>window.ChannelIO('showMessenger')}>
            <Text T6 medium>고객센터 연결</Text>
          </LineButton>
          <LineButton onClick={()=>window.open('https://forms.gle/RNpf1d3tvndL2Tfd7', '_blank')}>
            <Text T6 medium>진료영상 첨부</Text>
          </LineButton>
          <LineButton onClick={()=>setIsDiagnosisOpend(!isDiagnosisOpend)}>
            <Text T6 medium>{isDiagnosisOpend?'미리보기 닫기':'소견서 미리보기'}</Text>
          </LineButton>
          <SaveButton onClick={()=>handleTreatmentSubmit()}>
            <Text T6 medium color='#FFFFFF'>제출</Text>
          </SaveButton>
        </Row>
      </TelemedicineSector2>
    </TelemedicineContainer>
  );
}

export default Telemedicine;

const TelemedicineContainer = styled.div`
  position: relative;
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
  align-items: flex-end;
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
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 20px;
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

const Section = styled(Row)`
  width: 100%;
  border-bottom: 1px solid ${COLOR.GRAY7};
  align-items: stretch;
`;

const Title = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${COLOR.GRAY6};
`

const InputWrapper = styled.div`
  width: 100%;
  padding: 10px 0px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TextInput = styled.input`
  width: 100%;
  height: 28px;
  padding: 2px 10px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY4};
  font-size: 13px;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 55px;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY4};
  font-size: 13px;
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

const RadioButton = styled.input`
  margin: 0px;
  width: 12px;
`

const LineButton = styled.div`
  width: 111px;
  padding: 15px 10px;
  background-color: #FFFFFF;
  border-radius: 5px;
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor:pointer;
`

const SaveButton = styled.div`
  width: 111px;
  padding: 15px 20px;
  background: ${COLOR.MAIN};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`