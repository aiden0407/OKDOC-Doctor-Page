//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'constants/design';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, Column, FlexBox } from 'components/Flex';

//Assets
import arrowIcon from 'assets/icons/arrow.svg';

function MenuTab() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state: { isMenuTabOpened } } = useContext(Context);
  const [menuStatus, setMenuStatus] = useState('');
  const [isFirstMenuHovered, setIsFirstMenuHovered] = useState(false);
  const [isSecondMenuHovered, setIsSecondMenuHovered] = useState(false);

  useEffect(() => {
    switch (location.pathname) {
      case '/calendar':
      case '/calendar/detail':
      case '/telemedicine':
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

      <Column onMouseEnter={()=>setIsFirstMenuHovered(true)} onMouseLeave={()=>setIsFirstMenuHovered(false)}>
        <StyledRow padding="0 10px" opened={menuStatus==="원격진료 진료 현황" || menuStatus==="진료 스케줄 관리" || isFirstMenuHovered}>
          <Text T5 bold={menuStatus==="원격진료 진료 현황" || menuStatus==="진료 스케줄 관리" || isFirstMenuHovered}>원격진료 관리</Text>
          <FlexBox />
          <Image src={arrowIcon} width={20} />
        </StyledRow>
        <SubMenuWrapper className={(menuStatus==="원격진료 진료 현황" || menuStatus==="진료 스케줄 관리" || isFirstMenuHovered) && 'open'}>
          <SubMenuButton className={menuStatus === "원격진료 진료 현황" && 'selected'} onClick={()=>navigate('/calendar')}>
            <Text T5 bold={menuStatus === "원격진료 진료 현황"} color={menuStatus === "원격진료 진료 현황" && COLOR.MAIN}>원격진료 진료 현황</Text>
          </SubMenuButton>
          <SubMenuButton className={menuStatus === "진료 스케줄 관리" && 'selected'} onClick={()=>navigate('/schedule')}>
            <Text T5 bold={menuStatus === "진료 스케줄 관리"} color={menuStatus === "진료 스케줄 관리" && COLOR.MAIN}>진료 스케줄 관리</Text>
          </SubMenuButton>
        </SubMenuWrapper>
      </Column>

      <Column onMouseEnter={()=>setIsSecondMenuHovered(true)} onMouseLeave={()=>setIsSecondMenuHovered(false)}>
        <StyledRow padding="0 10px" marginTop={20} opened={menuStatus==="개인정보" || menuStatus==="비밀번호 변경" || isSecondMenuHovered}>
          <Text T5 bold={menuStatus==="개인정보" || menuStatus==="비밀번호 변경" || isSecondMenuHovered}>설정</Text>
          <FlexBox />
          <Image src={arrowIcon} width={20} />
        </StyledRow>
        <SubMenuWrapper className={(menuStatus==="개인정보" || menuStatus==="비밀번호 변경" || isSecondMenuHovered) && 'open'}>
          <SubMenuButton className={menuStatus === "개인정보" && 'selected'} onClick={()=>navigate('/setting/info')}>
            <Text T5 bold={menuStatus === "개인정보"} color={menuStatus === "개인정보" && COLOR.MAIN}>개인정보</Text>
          </SubMenuButton>
          <SubMenuButton className={menuStatus === "비밀번호 변경" && 'selected'} onClick={()=>navigate('/setting/pw')}>
            <Text T5 bold={menuStatus === "비밀번호 변경"} color={menuStatus === "비밀번호 변경" && COLOR.MAIN}>비밀번호 변경</Text>
          </SubMenuButton>
        </SubMenuWrapper>
      </Column>
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
  transition: all 0.3s;
`;

const StyledRow = styled(Row)`
  padding: ${(props) => props.padding ?? '0'};
  cursor: pointer;
`;

const SubMenuWrapper = styled.div`
  margin-top: 10px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 5px;
  &.open {
    max-height: 1000px;
  }
`;

const SubMenuButton = styled.div`
  width: 100%;
  padding: 10px 0 10px 30px;
  border-radius: 15px;
  cursor: pointer;
  &:hover {
    background: #F1E8FF66;
  }
  &.selected {
    background: ${COLOR.SUB3};
  }
`;