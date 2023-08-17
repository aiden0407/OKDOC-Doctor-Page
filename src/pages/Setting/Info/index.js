//React
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

//Components
import { COLOR } from 'constants/design';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, Column, FlexBox, RelativeWrapper } from 'components/Flex';

//Assets
import defaultProfileIcon from 'assets/icons/default_profile.png';
import editIcon from 'assets/icons/edit.svg';

function Calendar() {

  const [profileFile, setProfileFile] = useState();
  const [profileImage, setProfileImage] = useState();
  const [department, setDepartment] = useState('');
  const [strength, setStrength] = useState('');
  const [field, setField] = useState('');
  const [introductionTitle, setIntroductionTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [editable, setEditable] = useState(false);
  const fileInputRef = useRef(null);

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
                <Image src={profileImage ?? defaultProfileIcon} width={100} borderRadius="50%" />
                {
                  editable && <Image src={editIcon} width={30} style={{position:'absolute', bottom: 6, right: 1}} />
                }
              </RelativeWrapper>

              <Column marginLeft={40}>
                <Row>
                  <Text T2 bold>김형도</Text>
                  <Text T4 bold marginTop={4}>&nbsp;/ 을지대 병원 (의정부)</Text>
                </Row>
                <Text T3>logan@insunginfo.co.kr</Text>
              </Column>
            </Row>

            <Row marginTop={36} style={{width: '100%', padding: '0 10px'}}>
              <Text T4 bold style={{width: '25%'}}>성별</Text>
              <Text T4 style={{width: '25%'}}>남성</Text>
              <Text T4 bold style={{ width: '25%' }}>전화 번호</Text>
              <Text T4 style={{ width: '25%' }}>010-6607-5776</Text>
            </Row>

            <Row marginTop={24} style={{ width: '100%', padding: '0 10px' }}>
              <Text T4 bold style={{ width: '25%' }}>생년월일</Text>
              <Text T4 style={{ width: '25%' }}>1999.02.13</Text>
              <Text T4 bold style={{ width: '25%' }}>의사 면허 번호</Text>
              <Text T4 style={{ width: '25%' }}>제 00000 호</Text>
            </Row>
          </ProfileWrapper>

          <Section marginTop={60}>
            <Title height={50}>
              <Text T6 bold>진료과</Text>
            </Title>
            <InputWrapper>
              <DepartmentSelector disabled={!editable} value={department} onChange={(event) => setDepartment(event.target.value)}>
                <option value="">진료과를 선택하세요.</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
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
              <Text T7 color="#428EFF" marginTop={10}>*환자가 진료 예약 시 확인하는 정보입니다. 각 증상은 콤마(,)로 구분을 해주시기 바랍니다. 예) 뇌졸중, 당뇨, 치매</Text>
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

        <Text T2 bold>휴대폰영역휴대폰영역휴대폰영역</Text>
      </InfoWrapper>

      <Row marginTop={36} style={{ width: '100%', gap: 30 }}>
        <FlexBox />
        <EditButton onClick={()=>setEditable(true)}>
          <Text T6 medium>수정</Text>
        </EditButton>
        <SaveButton>
          <Text T6 medium color="#FFFFFF">저장</Text>
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

const ProfileSection = styled.div`
  width: 25%;
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
`

const EditButton = styled.div`
  width: 80px;
  padding: 15px 20px;
  border-radius: 5px;
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const SaveButton = styled.div`
  width: 80px;
  padding: 15px 20px;
  background-color: ${COLOR.MAIN};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`