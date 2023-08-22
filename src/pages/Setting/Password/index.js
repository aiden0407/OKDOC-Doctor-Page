//React
import { useState } from 'react';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Row, Column, FlexBox, DividingLine } from 'components/Flex';

function Calendar() {

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <>
      <Text T2 bold>비밀번호 변경</Text>

      <PasswordBox>
        <StyledColumn>
          <Section>
            <Title>
              <Text T6 bold>아이디</Text>
            </Title>
            <InputWrapper>
              <TextInput
                readonly
                type="text"
                value="logan@insunginfo.co.kr"
              />
            </InputWrapper>
          </Section>

          <Section>
            <Title>
              <Text T6 bold>현재 비밀번호</Text>
            </Title>
            <InputWrapper>
              <TextInput
                type="password"
                placeholder="기존 비밀번호를 입력해주세요"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
        </StyledColumn>

        <DividingLine color={COLOR.GRAY5} />

        <StyledColumn>
          <Section>
            <Title>
              <Text T6 bold>새 비밀번호</Text>
            </Title>
            <InputWrapper>
              <TextInput
                type="password"
                placeholder="영문, 숫자, 특수문자 포함 6~14자"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>

          <Section>
            <Title>
              <Text T6 bold>새 비밀번호 확인</Text>
            </Title>
            <InputWrapper>
              <TextInput
                type="password"
                placeholder="새 비밀번호를 입력해주세요"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
            </InputWrapper>
          </Section>
        </StyledColumn>
      </PasswordBox>

      <Row marginTop={36} style={{width: '100%'}}>
        <FlexBox />
        <SaveButton>
          <Text T6 medium color="#FFFFFF">저장</Text>
        </SaveButton>
      </Row>
    </>
  );
}

export default Calendar;

const PasswordBox = styled.div`
  margin-top: 80px;
  width: 100%;
  padding: 50px 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  box-shadow: 0px 20px 40px 0px rgba(134, 142, 150, 0.10);
`

const StyledColumn = styled(Column)`
  width: 100%;
  max-width: 950px;
`;

const Section = styled(Row)`
  width: 100%;
  border-bottom: 1px solid ${COLOR.GRAY4};
`;

const Title = styled.div`
  width: 150px;
  padding: 15px 15px 15px 20px;
  background-color: ${COLOR.GRAY6};
`

const InputWrapper = styled.div`
  width: 100%;
  padding: 10px 5px 10px 25px;
  display: flex;
  align-items: center;
`

const TextInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid ${COLOR.GRAY4};
  font-size: 14px;
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