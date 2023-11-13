//React
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';

//Api
import { doctorLogin, getDoctorInfoByCredential } from 'apis/Login';

//Assets
import loginBackgroundImage from 'assets/images/login_background.png';
import loginDecoImage from 'assets/images/login_deco.png';
import loginLogoImage from 'assets/images/login_logo.png';
import mailIcon from 'assets/icons/mail.svg';
import passwordIcon from 'assets/icons/password.svg';


function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
    if (sessionToken) {
      navigate('/calendar', { replace: true });
    }
  }, [location.pathname]);

  const handleSignIn = async function () {
    if (!email.length) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    if (!password.length) {
      alert('비밀번호를 입력해 주세요.');
      return;
    }

    try {
      const response = await doctorLogin(email, password);
      sessionStorage.setItem('OKDOC_DOCTOR_TOKEN', response.data.response.accessToken);
      getDoctorInfo(response.data.response.accessToken)
    } catch (error) {
      alert(Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message);
    }
  }

  const getDoctorInfo = async function (accessToken) {
    try {
      const response = await getDoctorInfoByCredential(accessToken);
      sessionStorage.setItem('OKDOC_DOCTOR_INFO', JSON.stringify(response.data.response[0]));
      if(password==='Eulji1234*'){
        alert('보안을 위해 초기 비밀번호를 변경해주세요.\n확인 버튼을 클릭 시, 비밀번호 변경을 도와드리겠습니다.')
        navigate('/setting/pw');
      } else {
        navigate('/calendar');
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <Container>
      <LoginContainer>
        <DecoImage src={loginDecoImage} />

        <InnerContainer>
          <LogoImage src={loginLogoImage} />

          <Text T1 bold>Sign In</Text>
          <Text T5 color={COLOR.GRAY2} marginTop={16}>의사 계정으로 로그인 해주세요</Text>
          <InputWrapper style={{marginTop: '32px'}}>
            <IconImage src={mailIcon} />
            <BorderInput
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </InputWrapper>
          <InputWrapper style={{marginTop: '16px'}}>
            <IconImage src={passwordIcon} />
            <BorderInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  handleSignIn();
                }
              }}
            />
          </InputWrapper>
          <LoginButton onClick={() => handleSignIn()}>
            <Text T6 color="#FFFFFF">Login</Text>
          </LoginButton>

          <Text T6 color={COLOR.GRAY2} marginTop={16} style={{cursor: 'pointer'}} onClick={()=>navigate('/find-password')}>비밀번호를 잊으셨나요?</Text>
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
  width: 420px;
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
  width: 200px;
`

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
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

const LoginButton = styled.div`
  margin-top: 16px;
  width: 100%;
  height: 60px;
  background-color: ${COLOR.MAIN};
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`