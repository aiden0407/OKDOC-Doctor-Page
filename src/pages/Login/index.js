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
      // const response = await doctorLogin(email, password);
      const response = {
        data: {
          response: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikluc3VuZ2luZm9fdXNlcl9jcmVkZW50aWFsIn0.eyJlbWFpbCI6IuuptO2XiOuyiO2YuDEiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNjkyODUxNzcxLCJleHAiOjE2OTY0NTE3NzEsImF1ZCI6ImxvY2FsaG9zdDozMDAwIiwiaXNzIjoibG9jYWxob3N0OjMwMDAiLCJzdWIiOiLrqbTtl4jrsojtmLgxIiwianRpIjoiMTY5Mjg1MTc3MTA1MiJ9.aWNCTKKSxlvDdbvbPZ_T4eQn8fQbO4KA40AXdhY_HC4'
          }
        }
      }
      sessionStorage.setItem('OKDOC_DOCTOR_TOKEN', response.data.response.accessToken);
      getDoctorInfo(response.data.response.accessToken)
    } catch (error) {
      alert(error);
    }
  }

  const getDoctorInfo = async function (accessToken) {
    try {
      // const response = await getDoctorInfoByCredential(accessToken);
      const response = {
        data: {
          response: {
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
            "photo": "https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg",
            "created_at": "2023-07-14T07:54:16.189Z",
            "updated_at": "2023-07-14T07:54:16.189Z",
            "__v": 0
          }
        }
      }
      sessionStorage.setItem('OKDOC_DOCTOR_INFO', JSON.stringify(response.data.response));
      navigate('/calendar');
    } catch (error) {
      alert(error);
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

          <Text T6 color={COLOR.GRAY2} marginTop={16} style={{cursor: 'pointer'}} onClick={()=>window.ChannelIO('showMessenger')}>비밀번호를 잊으셨나요?</Text>
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