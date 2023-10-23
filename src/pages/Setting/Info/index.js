//React
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, Column, FlexBox, RelativeWrapper, DividingLine } from 'components/Flex';

//Api
import { getDepartments, editDoctorInfo } from 'apis/Setting';
import { getDoctorInfoByCredential } from 'apis/Login';

//Assets
import defaultProfileIcon from 'assets/icons/default_profile.png';
import editIcon from 'assets/icons/edit.svg';
import phoneSpeakerIcon from 'assets/icons/phone_speaker.svg';

function Calendar() {

  const [profileData, setProfileData] = useState();
  const [departmentsList, setDepartmentsList] = useState([]);
  const [profileFile, setProfileFile] = useState();
  const [profileImage, setProfileImage] = useState();
  const [department, setDepartment] = useState('');
  const [strength, setStrength] = useState('');
  const [field, setField] = useState('');
  const [introductionTitle, setIntroductionTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [editable, setEditable] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const sessionStorageData = sessionStorage.getItem('OKDOC_DOCTOR_INFO');
    if(sessionStorageData){
      const storedLoginData = JSON.parse(sessionStorageData);
      setProfileData(storedLoginData);
      setProfileImage(storedLoginData?.attachments[0]?.Location ?? storedLoginData.photo);
      setDepartment(storedLoginData.department);
      setStrength(storedLoginData.strength.join(','));
      setField(storedLoginData.field.join('\n'));
      setIntroductionTitle(storedLoginData.self_introduction_title);
      setIntroduction(storedLoginData.self_introduction);
      initDepartments();
    }
  }, []);

  const initDepartments = async function () {
    try {
      const response = await getDepartments();
      setDepartmentsList(response.data.response);
    } catch (error) {
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function convertToHashtags(text) {
    const words = text.split(',');
    const hashtags = words.map(word => `#${word}`);
    return hashtags.join(' ');
  }

  function addDotToLines(text) {
    const lines = text.split('\n');
    const dottedLines = lines.map(line => `· ${line}`);
    return dottedLines.join('\n');
  }

  function convertStringToArraySplitComma(inputString) {
    return inputString.split(',').map(item => item.trim());
  }

  function convertStringToArraySplitLine(inputString) {
    return inputString.split('\n').map(item => item.trim());
  }

  const handleDoctorDataSave = async function () {
    try {
      const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
      const sessionStorageData = sessionStorage.getItem('OKDOC_DOCTOR_INFO');
      const storedLoginData = JSON.parse(sessionStorageData);
      const body = {
        "department": department,
        "strength": convertStringToArraySplitComma(strength),
        "field": convertStringToArraySplitLine(field),
        "self_introduction_title": introductionTitle,
        "self_introduction": introduction,
        "images": profileFile
      }
      console.log(body)
      await editDoctorInfo(sessionToken, storedLoginData.id, body);
      getDoctorInfo(sessionToken);
    } catch (error) {
      console.log(error);
      alert('네트워크 오류로 인해 정보를 불러오지 못했습니다.');
    }
  }

  const getDoctorInfo = async function (accessToken) {
    try {
      const response = await getDoctorInfoByCredential(accessToken);
      sessionStorage.setItem('OKDOC_DOCTOR_INFO', JSON.stringify(response.data.response[0]));
      window.location.reload();
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <InfoContainer>
      <Text T2 bold>개인정보</Text>

      <InfoWrapper>
        <StyledColumn>
          <ProfileWrapper>
            <Row>
              <RelativeWrapper
                onClick={() => {
                  if (editable) {
                    fileInputRef.current.click()
                  }
                }}
                style={editable ? { cursor: 'pointer' } : {}}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
                <Image src={profileImage ?? defaultProfileIcon} width={100} height={100} borderRadius="50%" />
                {
                  editable && <Image src={editIcon} width={30} style={{ position: 'absolute', bottom: 6, right: 1 }} />
                }
              </RelativeWrapper>

              <Column marginLeft={40}>
                <Row>
                  <Text T2 bold>{profileData?.name}</Text>
                  <Text T4 bold marginTop={4}>&nbsp;/ {profileData?.hospital}</Text>
                </Row>
                <Text T3>{profileData?.email}</Text>
              </Column>
            </Row>

            <Row marginTop={36} style={{ width: '100%', padding: '0 10px' }}>
              <Text T4 bold style={{ width: '25%' }}>성별</Text>
              <Text T4 style={{ width: '25%' }}>{profileData?.gender === 'MALE' ? '남성' : profileData?.gender === 'FEMALE' ? '여성' : ''}</Text>
              <Text T4 bold style={{ width: '25%' }}>전화 번호</Text>
              <Text T4 style={{ width: '25%' }}>{profileData?.phone?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</Text>
            </Row>

            <Row marginTop={24} style={{ width: '100%', padding: '0 10px' }}>
              {/* <Text T4 bold style={{ width: '25%' }}>생년월일</Text>
              <Text T4 style={{ width: '25%' }}>0000.00.00</Text> */}
              <Text T4 bold style={{ width: '25%' }}>의사 면허 번호</Text>
              <Text T4 style={{ width: '25%' }}>제 {profileData?.id} 호</Text>
            </Row>
          </ProfileWrapper>

          <Section marginTop={60}>
            <Title height={50}>
              <Text T6 bold>진료과</Text>
            </Title>
            <InputWrapper>
              <DepartmentSelector disabled={!editable} value={department} onChange={(event) => setDepartment(event.target.value)}>
                <option value="">진료과를 선택하세요.</option>
                {
                  departmentsList?.map((item) =>
                    <option value={item.name} key={item._id}>{item.name}</option>
                  )
                }
              </DepartmentSelector>
            </InputWrapper>
          </Section>

          <Section>
            <Title height={76}>
              <Text T6 bold>진료 증상</Text>
            </Title>
            <InputWrapper>
              <TextInput
                disabled={!editable}
                type="text"
                placeholder="진료하시는 대표 질병 혹은 증상을 최대 3개 입력해주세요."
                value={strength}
                onChange={(event) => {
                  setStrength(event.target.value);
                }}
              />
              <Text T7 color="#428EFF" marginTop={10}>*환자가 진료 예약 시 확인하는 정보입니다. 각 증상은 콤마(,)로 구분을 해주시기 바랍니다. 예) 뇌졸증, 당뇨, 치매</Text>
            </InputWrapper>
          </Section>

          <Section>
            <Title height={76}>
              <Text T6 bold>약력</Text>
            </Title>
            <InputWrapper>
              <TextArea
                disabled={!editable}
                height={150}
                placeholder={`학력 혹은 약력을 입력해주세요.\n •\n •\n •`}
                value={field}
                onChange={(event) => {
                  setField(event.target.value);
                }}
              />
              <Text T7 color="#428EFF" marginTop={10}>*환자가 진료 예약 시 확인하는 정보입니다. 엔터키를 치시면, 자동으로 구분되어 입력됩니다.</Text>
            </InputWrapper>
          </Section>

          <Section>
            <Title height={76}>
              <Text T6 bold>자기소개 제목</Text>
            </Title>
            <InputWrapper>
              <TextInput
                disabled={!editable}
                type="text"
                placeholder="한줄 자기 소개를 입력해주세요. (30글자)"
                maxLength={30}
                value={introductionTitle}
                onChange={(event) => {
                  setIntroductionTitle(event.target.value);
                }}
              />
              <Text T7 color="#428EFF" marginTop={10}>*환자가 진료 예약 시 확인하는 정보입니다.</Text>
            </InputWrapper>
          </Section>

          <Section>
            <Title height={76}>
              <Text T6 bold>자기소개 본문</Text>
            </Title>
            <InputWrapper>
              <TextArea
                disabled={!editable}
                height={230}
                placeholder="자기소개를 입력해주세요."
                value={introduction}
                onChange={(event) => {
                  setIntroduction(event.target.value);
                }}
              />
              <Text T7 color="#428EFF" marginTop={10}>*환자가 진료 예약 시 확인하는 정보입니다.</Text>
            </InputWrapper>
          </Section>
        </StyledColumn>

        <PhoneContainer>
          <PhoneContensWrapper>

            <PhoneDecoration src={phoneSpeakerIcon} width={73}/>

            <Row>
              <Image src={profileImage ?? defaultProfileIcon} width={66} height={66} borderRadius="50%" />
              <Column marginLeft={24}>
                <Text T4 bold>{profileData?.name}</Text>
                <Text T7 bold color={COLOR.GRAY1}>{profileData?.hospital}/{department}</Text>
                <Text T7 marginTop={12} color={COLOR.GRAY2}>{strength ? convertToHashtags(strength) : '#진료 증상'}</Text>
              </Column>
            </Row>

            <StyledDividingLine marginTop={34} color={COLOR.GRAY6} />

            <Text T4 bold color={COLOR.GRAY1} marginTop={34}>학력 및 이력</Text>
            <Text T6 color={COLOR.GRAY1} marginTop={12} style={{ lineHeight: '28px' }}>{field ? addDotToLines(field) : '· 을지대 병원 (의정부)'}</Text>

            <StyledDividingLine marginTop={24} color={COLOR.GRAY6} />

            <Text T4 bold marginTop={28} style={{ width: '100%', wordWrap: 'break-word' }}>{introductionTitle ? introductionTitle : '자기소개 제목'}</Text>
            <Text T6 marginTop={18} style={{ width: '100%', wordWrap: 'break-word' }}>{introduction ? introduction : '자기소개 내용'}</Text>

            <PhoneButton>
              <Text T4 color="#FFFFFF">진료 예약신청</Text>
            </PhoneButton>
          </PhoneContensWrapper>
        </PhoneContainer>
      </InfoWrapper>

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
            handleDoctorDataSave();
          }
        }}>
          <Text T6 medium color={editable ? '#FFFFFF' : COLOR.GRAY1}>저장</Text>
        </SaveButton>
      </Row>
    </InfoContainer>
  );
}

export default Calendar;

const InfoContainer = styled(Column)`
  width: 100%;
  padding-bottom: 150px;
`;

const InfoWrapper = styled.div`
  margin-top: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 100px;
`

const StyledColumn = styled(Column)`
  width: 100%;
  max-width: 950px;
`;

const ProfileWrapper = styled.div`
  width: 100%;
  max-width: 780px;
  display: flex;
  flex-direction: column;
`

const Section = styled(Row)`
  width: 100%;
  border-bottom: 1px solid ${COLOR.GRAY4};
  align-items: stretch;
`;

const Title = styled.div`
  width: 150px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  background-color: ${COLOR.GRAY6};
`

const InputWrapper = styled.div`
  width: 100%;
  padding: 10px 5px 10px 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const DepartmentSelector = styled.select`
  width: 200px;
  height: 30px;
  padding: 5px 0 5px 10px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY4};
  font-size: 14px;
`

const TextInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY4};
  font-size: 14px;
`

const TextArea = styled.textarea`
  width: 100%;
  height: ${props => props.height}px;
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY4};
  font-size: 14px;
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

const PhoneContainer = styled.div`
  position: relative;
  width: 360px;
  min-width: 360px;
  height: 740px;
  padding: 60px 0px 100px 20px;
  border-radius: 40px;
  border: 4px solid ${COLOR.GRAY4};
  overflow: hidden;
`

const PhoneDecoration = styled(Image)`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0%);
`

const PhoneContensWrapper = styled(Column)`
  width: 100%;
  height: 100%;
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

const StyledDividingLine = styled(DividingLine)`
  width: calc(100% - 20px);
  min-height: 1px;
`

const PhoneButton = styled.div`
  position: absolute;
  bottom: 20px;
  width: 310px;
  height: 56px;
  border-radius: 5px;
  background-color: ${COLOR.MAIN};
  display: flex;
  justify-content: center;
  align-items: center;
`