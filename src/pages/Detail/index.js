//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR, TYPOGRAPHY } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row } from 'components/Flex';

//Api
import { getAppointmentInfoById } from 'api/Telemedicine';

//Assets
import arrowIcon from 'assets/icons/arrow_solid.svg';

function Calendar() {

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appointmentId = searchParams.get('id');

  const [appointmentData, setAppointmentData] = useState([]);
  const [menuStatus, setMenuStatus] = useState('');

  useEffect(() => {
    switch (location.pathname) {
      case '/calendar/detail':
        setMenuStatus('원격진료 진료 현황');
        break;

      case '/schedule/detail':
        setMenuStatus('진료 스케줄 관리');
        break;

      default:
        break;
    }
  }, [location]);

  useEffect(() => {
    if (appointmentId) {
      initAppointmentData()
    }
  }, []);

  const initAppointmentData = async function () {
    try {
      // const response = await getAppointmentInfoById(appointmentId);

      const response = {
        data: {
          response: {
            "_id": "64c8bc3ef780cc2f77577c82",
            "id": "20c7dde4-3b78-4ec8-b18c-09fa9b86983a",
            "patient": {
              "_id": "64b0983a39661390eb15f24b",
              "id": "M477Y2913",
              "family_id": "aiden@insunginfo.co.kr",
              "gender": "MALE",
              "relationship": "본인",
              "passport": {
                "user_name": "이준범",
                "passport_number": "M477Y2913",
                "issue_date": 20230315,
                "close_date": 20330315,
                "birth": 19980407
              },
              "created_at": "2023-07-14T00:35:06.607Z",
              "updated_at": "2023-08-01T08:02:36.301Z",
              "__v": 0,
              "allergic_reaction": "",
              "consideration": "",
              "drinker": "NONE",
              "family_medical_history": "",
              "height": 180,
              "medical_history": "",
              "medication": "",
              "smoker": "NONE",
              "weight": 80
            },
            "category": "appointment",
            "department": "가정의학과",
            "doctor": {
              "_id": "64b0ff283f70153e570047e8",
              "id": "b1fe2079-df9b-411a-93ee-bf21cb0c77bd",
              "hospital": "을지대 병원 (의정부)",
              "department": "가정의학과",
              "name": "허연",
              "strength": [
                "가정의학"
              ],
              "landline": "01072849850",
              "phone": "01072849850",
              "gender": "female",
              "field": [
                "고려대학교 대학원 가정의학 박사",
                "이화여자대학교 의과대학 졸업",
                "의정부을지대학교병원 가정의학과 교수, 가정의학과 과장",
                "서울아산병원 가정의학과 전임의",
                "일산백병원 가정의학과 전임의",
                "고려대학고 안산병원 가정의학과 전임의"
              ],
              "self_introduction_title": "안녕하세요. 허연입니다.",
              "self_introduction": "바른 진료, 진심을 담은 진료 약속드립니다.",
              "email": "higjdus@eulji.ac.kr",
              "schedules": [
                {
                  "id": "648fcf01ceefd680de5d00b0",
                  "open_at": "2023-07-24T14:00:00.000Z",
                  "close_at": "2023-07-24T14:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00b1",
                  "open_at": "2023-07-24T14:20:00.000Z",
                  "close_at": "2023-07-24T14:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00b2",
                  "open_at": "2023-07-24T14:40:00.000Z",
                  "close_at": "2023-07-24T15:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00b3",
                  "open_at": "2023-07-24T15:00:00.000Z",
                  "close_at": "2023-07-24T15:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00b4",
                  "open_at": "2023-07-24T15:20:00.000Z",
                  "close_at": "2023-07-24T15:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00b5",
                  "open_at": "2023-07-24T15:40:00.000Z",
                  "close_at": "2023-07-24T16:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00c0",
                  "open_at": "2023-07-25T14:00:00.000Z",
                  "close_at": "2023-07-25T14:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00c1",
                  "open_at": "2023-07-25T14:20:00.000Z",
                  "close_at": "2023-07-25T14:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00c2",
                  "open_at": "2023-07-25T14:40:00.000Z",
                  "close_at": "2023-07-25T15:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00c3",
                  "open_at": "2023-07-25T15:00:00.000Z",
                  "close_at": "2023-07-25T15:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00c4",
                  "open_at": "2023-07-25T15:20:00.000Z",
                  "close_at": "2023-07-25T15:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00c5",
                  "open_at": "2023-07-25T15:40:00.000Z",
                  "close_at": "2023-07-25T16:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00d0",
                  "open_at": "2023-07-26T14:00:00.000Z",
                  "close_at": "2023-07-26T14:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00d1",
                  "open_at": "2023-07-26T14:20:00.000Z",
                  "close_at": "2023-07-26T14:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00d2",
                  "open_at": "2023-07-26T14:40:00.000Z",
                  "close_at": "2023-07-26T15:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00d3",
                  "open_at": "2023-07-26T15:00:00.000Z",
                  "close_at": "2023-07-26T15:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00d4",
                  "open_at": "2023-07-26T15:20:00.000Z",
                  "close_at": "2023-07-26T15:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00d5",
                  "open_at": "2023-07-26T15:40:00.000Z",
                  "close_at": "2023-07-26T16:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00e0",
                  "open_at": "2023-07-27T14:00:00.000Z",
                  "close_at": "2023-07-27T14:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00e1",
                  "open_at": "2023-07-27T14:20:00.000Z",
                  "close_at": "2023-07-27T14:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00e2",
                  "open_at": "2023-07-27T14:40:00.000Z",
                  "close_at": "2023-07-27T15:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00e3",
                  "open_at": "2023-07-27T15:00:00.000Z",
                  "close_at": "2023-07-27T15:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00e4",
                  "open_at": "2023-07-27T15:20:00.000Z",
                  "close_at": "2023-07-27T15:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00e5",
                  "open_at": "2023-07-27T15:40:00.000Z",
                  "close_at": "2023-07-27T16:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00f0",
                  "open_at": "2023-07-28T14:00:00.000Z",
                  "close_at": "2023-07-28T14:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00f1",
                  "open_at": "2023-07-28T14:20:00.000Z",
                  "close_at": "2023-07-28T14:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00f2",
                  "open_at": "2023-07-28T14:40:00.000Z",
                  "close_at": "2023-07-28T15:00:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00f3",
                  "open_at": "2023-07-28T15:00:00.000Z",
                  "close_at": "2023-07-28T15:20:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00f4",
                  "open_at": "2023-07-28T15:20:00.000Z",
                  "close_at": "2023-07-28T15:40:00.000Z"
                },
                {
                  "id": "648fcf01ceefd680de5d00f5",
                  "open_at": "2023-08-01T08:20:00.000Z",
                  "close_at": "2023-08-01T08:40:00.000Z"
                }
              ],
              "photo": "https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg",
              "created_at": "2023-07-14T07:54:16.189Z",
              "updated_at": "2023-07-14T07:54:16.189Z",
              "__v": 0
            },
            "wish_at": "2023-08-04T01:00:00.000Z",
            "explain_symptom": "아파요",
            "attachments": [
              {
                "ETag": "\"05aed33281bbb598927d3b6e5f16a384\"",
                "ServerSideEncryption": "AES256",
                "Location": "https://unsafe-public-okdoc-user-upload-image.s3.ap-northeast-2.amazonaws.com/M477Y2913/submit/a2a8e1ad-9435-4bd3-97da-478e704c2524.jpg",
                "key": "M477Y2913/submit/a2a8e1ad-9435-4bd3-97da-478e704c2524.jpg",
                "Key": "M477Y2913/submit/a2a8e1ad-9435-4bd3-97da-478e704c2524.jpg",
                "Bucket": "unsafe-public-okdoc-user-upload-image"
              }
            ],
            "hospital_treatment_room": {
              "uuid": "ZT8AXBgtSeSrHz34lcWs2g==",
              "id": 83394258138,
              "host_id": "rVaXfy_PRLOoBX2LOdUxdw",
              "host_email": "devapple@insunginfo.co.kr",
              "topic": "My Meeting1",
              "type": 2,
              "status": "waiting",
              "start_time": "2023-07-31T23:20:00Z",
              "duration": 900,
              "timezone": "Asia/Seoul",
              "agenda": "My Meeting1",
              "created_at": "2023-08-01T08:03:10Z",
              "start_url": "https://us06web.zoom.us/s/83394258138?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6InJWYVhmeV9QUkxPb0JYMkxPZFV4ZHciLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjEwMCwid2NkIjoidXMwNiIsImNsdCI6MCwibW51bSI6IjgzMzk0MjU4MTM4IiwiZXhwIjoxNjkwODg0MTkwLCJpYXQiOjE2OTA4NzY5OTAsImFpZCI6IlM0NVFka0tpVGF1M2hQS05jYlpabnciLCJjaWQiOiIifQ.AHjSWS4Byigdg6OgMSPwn_T9ApoF4psxkcFSsCpFcVI",
              "join_url": "https://us06web.zoom.us/j/83394258138?pwd=eW0veWNEYks3YzY3UEFBMHhrYjhYZz09",
              "password": "123456",
              "h323_password": "123456",
              "pstn_password": "123456",
              "encrypted_password": "eW0veWNEYks3YzY3UEFBMHhrYjhYZz09",
              "settings": {
                "host_video": true,
                "participant_video": true,
                "cn_meeting": false,
                "in_meeting": false,
                "join_before_host": true,
                "jbh_time": 0,
                "mute_upon_entry": false,
                "watermark": false,
                "use_pmi": false,
                "approval_type": 2,
                "audio": "voip",
                "auto_recording": "cloud",
                "enforce_login": false,
                "enforce_login_domains": "",
                "alternative_hosts": "",
                "alternative_host_update_polls": false,
                "close_registration": false,
                "show_share_button": false,
                "allow_multiple_devices": false,
                "registrants_confirmation_email": true,
                "waiting_room": false,
                "request_permission_to_unmute_participants": false,
                "registrants_email_notification": false,
                "meeting_authentication": false,
                "encryption_type": "enhanced_encryption",
                "approved_or_denied_countries_or_regions": {
                  "enable": false
                },
                "breakout_room": {
                  "enable": false
                },
                "alternative_hosts_email_notification": false,
                "show_join_info": false,
                "device_testing": false,
                "focus_mode": false,
                "enable_dedicated_group_chat": false,
                "private_meeting": false,
                "calendar_type": 1,
                "email_notification": false,
                "host_save_video_order": false,
                "sign_language_interpretation": {
                  "enable": false
                },
                "email_in_attendee_report": false
              },
              "pre_schedule": false
            },
            "bidding_id": "20c7dde4-3b78-4ec8-b18c-09fa9b86983a",
            "status": "EXIT",
            "createdAt": "2023-08-01T08:03:10.663Z",
            "updatedAt": "2023-08-04T00:44:09.262Z",
            "__v": 0
          }
        }
      }

      setAppointmentData(response.data.response)
    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  return (
    <div style={{paddingBottom: 100}}>
      <Row>
        <Text T2 bold color={COLOR.GRAY3}>{menuStatus}</Text>
        <Image src={arrowIcon} width={32} marginLeft={10} />
        <Text T2 bold color={COLOR.MAIN} marginLeft={10}>진료 상세</Text>
      </Row>

      <PatientInfoContainer>
        <PatientInfoBox>
          <Text T4 bold>Personal Information</Text>
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>Physical Data</Text>
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>Patient Conditions</Text>
          {
            appointmentData?.explain_symptom?.length
            ?<ContentsText>{appointmentData?.explain_symptom}</ContentsText>
            :<ContentsText color={COLOR.GRAY3}>없음</ContentsText>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>본인 병력</Text>
          {
            appointmentData?.patient?.medical_history?.length
            ?<ContentsText>{appointmentData?.patient?.medical_history}</ContentsText>
            :<ContentsText color={COLOR.GRAY3}>없음</ContentsText>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>가족 병력</Text>
          {
            appointmentData?.patient?.family_medical_history?.length
            ?<ContentsText>{appointmentData?.patient?.family_medical_history}</ContentsText>
            :<ContentsText color={COLOR.GRAY3}>없음</ContentsText>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>현재 복용중인 약</Text>
          {
            appointmentData?.patient?.medication?.length
            ?<ContentsText>{appointmentData?.patient?.medication}</ContentsText>
            :<ContentsText color={COLOR.GRAY3}>없음</ContentsText>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>알러지 반응</Text>
          {
            appointmentData?.patient?.allergic_reaction?.length
            ?<ContentsText>{appointmentData?.patient?.allergic_reaction}</ContentsText>
            :<ContentsText color={COLOR.GRAY3}>없음</ContentsText>
          }
        </PatientInfoBox>

        <PatientInfoBox>
          <Text T4 bold>기타 사항</Text>
          {
            appointmentData?.patient?.consideration?.length
            ?<ContentsText>{appointmentData?.patient?.consideration}</ContentsText>
            :<ContentsText color={COLOR.GRAY3}>없음</ContentsText>
          }
        </PatientInfoBox>
      </PatientInfoContainer>

      <Text T2 bold marginTop={54}>Consulting</Text>


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

const ContentsText = styled.p`
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