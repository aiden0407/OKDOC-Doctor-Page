//React
import { useEffect, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import Header from 'components/Header';
import MenuTab from 'components/MenuTab';
import { COLOR } from 'design/constant';

function Layout({ children }) {

  const navigate = useNavigate();
  const location = useLocation();
  const { state:{ isMenuTabOpened } } = useContext(Context);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('OKDOC_DOCTOR_TOKEN');
    if (!sessionToken) {
      navigate('/', { replace: true });
    }
  }, [location.pathname]);

  const handleChangeColor = (value) => {
    switch (value) {
      case '/calendar/detail':
      case '/schedule':
      case '/telemedicine':
        return COLOR.GRAY7;

      default:
        return '#FFFFFF';
    }
  };

  const handleChangeMaxWidth = (value) => {
    switch (value) {
      case '/calendar/detail':
      case '/schedule/detail':
      case '/telemedicine':
        return '1800px';

      default:
        return '1280px';
    }
  };

  return (
    <>
      <Container>
        <Header />

        <MenuTab />

        <BodyContainer isMenuTabOpened={isMenuTabOpened} background={handleChangeColor(location.pathname)}>
          <ContentsContainer maxWidth={handleChangeMaxWidth(location.pathname)}>
            {children}
          </ContentsContainer>
        </BodyContainer>
      </Container>
    </>
  )
}

export default Layout

const Container = styled.div`
  position: relative;
  width: 100vw;
`;

const BodyContainer = styled.div`
  width: ${(props) => props.isMenuTabOpened ? 'calc(100% - 250px)' : '100%'};
  margin-left: ${(props) => props.isMenuTabOpened ? '250px' : '0px'};
  height: calc(100vh - 70px);
  transition: all 0.3s;
  padding: 0 30px;
  display: flex;
  overflow-y: scroll;
  justify-content: center;
  background-color: ${(props) => props.background};
`;

const ContentsContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  display: flex;
  flex-direction: column;
`