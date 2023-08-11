//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'constants/design';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, FlexBox } from 'components/Flex';

//Assets
import arrowIcon from 'assets/icons/arrow.svg';

function MenuTab() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state: { isMenuTabOpened } } = useContext(Context);
  const [menuStatus, setMenuStatus] = useState('');

  useEffect(() => {
    switch (location.pathname) {
      case '/calendar':
      case '/calendar/detail':
        setMenuStatus('원격진료 진료 현황');
        break;

      case '/schedule':
      case '/schedule/detail':
        setMenuStatus('진료 스케줄 관리');
        break;

      case '/setting/info':
        setMenuStatus('개인정보');
        break;

      case '/setting/pw':
        setMenuStatus('비밀번호 변경');
        break;

      default:
        break;
    }
  }, [location]);

  return (
    <MenuTabContainer isMenuTabOpened={isMenuTabOpened}>
      <StyledRow padding="0 10px">
        <Text T5 bold>원격진료 관리</Text>
        <FlexBox />
        <Image src={arrowIcon} width={20} />
      </StyledRow>

      <StyledRow padding="0 10px">
        <Text T5 bold>설정</Text>
        <FlexBox />
        <Image src={arrowIcon} width={20} />
      </StyledRow>
    </MenuTabContainer>
  )
}

export default MenuTab

const MenuTabContainer = styled.div`
  position: absolute;
  top: 70px;
  left: ${(props) => props.isMenuTabOpened ? '0px' : '-250px'};
  width: 250px;
  height: calc(100vh - 70px);
  padding: 60px 20px;
  border-right: 1px solid ${COLOR.GRAY4};
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s;
`;

const StyledRow = styled(Row)`
  padding: ${(props) => props.padding ?? '0'};
  cursor: pointer;
`;