//React
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';

//Api
import { emailCheckOpen, emailCheckClose, changePassword } from 'apis/Login';

//Assets
import loginBackgroundImage from 'assets/images/login_background.png';
import loginDecoImage from 'assets/images/login_deco.png';
import loginLogoImage from 'assets/images/login_logo.png';
import mailIcon from 'assets/icons/mail.svg';
import sendIcon from 'assets/icons/send.svg';
import passwordIcon from 'assets/icons/password.svg';


function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailToken, setEmailToken] = useState();
  const [verificationToken, setVerificationToken] = useState();


  useEffect(() => {
    const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
    if (sessionToken) {
      navigate('/calendar', { replace: true });
    }
  }, [location.pathname]);

  function validateEmail(email) {
    const regExp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regExp.test(email);
  }

  const handleSendEmail = async function () {
    if (!email.length) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    if (!validateEmail(email)) {
      alert('이메일 형식을 다시 확인해주세요.');
      return;
    }

    try {
      const response = await emailCheckOpen(email);
      setEmailToken(response.data.response.message);
      setIsEmailSent(true);
      alert('해당 이메일로 인증번호가 발송 되었습니다.');
    } catch (error) {
      alert(Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message);
    }
  }

  const handleCheckVerificationCode = async function () {
    if (!verificationCode.length) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await emailCheckClose(email, verificationCode, emailToken);
      setVerificationToken(response.data.response.accessToken);
      setIsEmailVerified(true);
      alert('인증이 완료되었습니다.');
    } catch (error) {
      alert(Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message);
    }
  }

  function validatePassword(password) {
    const regExp = /^.*(?=^.{6,14}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[.?!@#$%^&*+=]).*$/;
    return regExp.test(password);
  }

  const handleChangePassword = async function () {
    if (!newPassword.length) {
      alert('새 비밀번호를 입력해 주세요.');
      return;
    }
    if (!confirmPassword.length) {
      alert('새 비밀번호 확인을 입력해 주세요.');
      return;
    }
    if (!validatePassword(newPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자 포함 6~14자로 구성되어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await changePassword(email, newPassword, verificationToken);
      alert('비밀번호가 변경되었습니다.');
      navigate('/');
    } catch (error) {
      alert(Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message);
    }
  }

  return (
    <Container>
      <LoginContainer>
        <DecoImage src={loginDecoImage} />

        <InnerContainer>
          <LogoImage src={loginLogoImage} />

          <Text T1 bold marginTop={80}>비밀번호 변경</Text>
          <Text T5 color={COLOR.GRAY2} marginTop={16}>가입하신 아이디(이메일)로 비밀번호를 변경하세요.</Text>
          <InputWrapper style={{marginTop: '32px'}}>
            <IconImage src={mailIcon} />
            <BorderInput
              disabled={isEmailVerified}
              type="text"
              placeholder="이메일 입력"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              style={{paddingRight: 90}}
            />
            {
              (!isEmailVerified) && <LineButton onClick={()=>handleSendEmail()}>
                <Text T7 color={COLOR.MAIN}>{isEmailSent ? '재전송' : '인증요청'}</Text>
              </LineButton>
            }
          </InputWrapper>

          <InputWrapper style={{marginTop: '16px'}}>
            <IconImage src={sendIcon} />
            <BorderInput
              disabled={isEmailVerified || !isEmailSent}
              type="number"
              placeholder="인증번호 입력"
              maxLength={6}
              value={verificationCode}
              onChange={(event) => {
                setVerificationCode(event.target.value);
              }}
            />
            {
              (isEmailSent && !isEmailVerified) && <LineButton onClick={()=>handleCheckVerificationCode()}>
                <Text T7 color={COLOR.MAIN}>인증확인</Text>
              </LineButton>
            }
          </InputWrapper>

          <InputWrapper style={{marginTop: '16px'}}>
            <IconImage src={passwordIcon} />
            <BorderInput
              disabled={!isEmailVerified}
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
            />
          </InputWrapper>

          <InputWrapper style={{marginTop: '16px'}}>
            <IconImage src={passwordIcon} />
            <BorderInput
              disabled={!isEmailVerified}
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
            />
          </InputWrapper>

          <LoginButton onClick={() => handleChangePassword()}>
            <Text T6 color="#FFFFFF">비밀번호 변경</Text>
          </LoginButton>
        </InnerContainer>
      </LoginContainer>

      <BackgroundContainer>
        <Image src={loginBackgroundImage} width="100%" height="100%" style={{minWidth: '960px'}} />
      </BackgroundContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`

const LoginContainer = styled.div`
  position: relative;
  width: 50%;
  height: 100vh;
  padding: 200px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BackgroundContainer = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  overflow: hidden;
`

const DecoImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
`

const InnerContainer = styled.div`
  position: relative;
  width: 500px;
  height: 100%;
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const LogoImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 40px;
  width: 200px;
`

const InputWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 60px;
`

const BorderInput = styled.input`
  width: 100%;
  height: 100%;
  border: 1px solid ${COLOR.GRAY5};
  border-radius: 100px;
  padding-left: 58px;
  &::placeholder {
    color: ${COLOR.GRAY3};
  }
`

const IconImage = styled(Image)`
  position: absolute;
  top: 18px;
  left: 24px;
  width: 24px;
`

const LineButton = styled.div`
  position: absolute;
  top: 14px;
  right: 17px;
  width: 60px;
  height: 30px;
  border-radius: 5px;
  border: 1px solid ${COLOR.MAIN};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const LoginButton = styled.div`
  margin-top: 16px;
  width: 300px;
  height: 60px;
  background-color: ${COLOR.MAIN};
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`