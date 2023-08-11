//React
import { useEffect, useContext } from 'react';
import { Context } from 'context';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import Header from 'components/Header';
import MenuTab from 'components/MenuTab';

function Layout({ children }) {

  const location = useLocation();
  const { state:{ isMenuTabOpened } } = useContext(Context);

  return (
    <>
      <Container>
        <Header />

        <MenuTab />

        <BodyContainer isMenuTabOpened={isMenuTabOpened}>
          {children}
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
`;