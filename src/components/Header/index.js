//React
import { useContext } from 'react';
import { Context } from 'context';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Image } from 'components/Image';

//Assets
import menuIcon from 'assets/icons/menu.svg';
import logoIcon from 'assets/icons/logo.png';

function Header() {

  const navigate = useNavigate();
  const { state:{ isMenuTabOpened }, dispatch } = useContext(Context);

  const toggleMenu = () => {
    if(isMenuTabOpened){
      dispatch({ type: 'CLOSE_MENU_TAB' })
    } else {
      dispatch({ type: 'OPEN_MENU_TAB' })
    }
  };

  return (
    <HeaderContainer>
      <MenuButton src={menuIcon} onClick={toggleMenu}/>

      <MainLogo src={logoIcon} onClick={()=>navigate('/calendar')} />
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.div`
  width: 100%;
  height: 70px;
  padding: 0 16px;
  border-bottom: 1px solid ${COLOR.GRAY4};
  display: flex;
  align-items: center;
`;

const MenuButton = styled(Image)`
  width: 30px;
  cursor: pointer;
`;

const MainLogo = styled(Image)`
  margin-left: 32px;
  width: 116px;
  cursor: pointer;
`;