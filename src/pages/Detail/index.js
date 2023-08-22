//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'design/constant';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, FlexBox, DividingLine } from 'components/Flex';

//Assets
import arrowIcon from 'assets/icons/arrow_solid.svg';

function Calendar() {

  const navigate = useNavigate();
  const location = useLocation();
  const [menuStatus, setMenuStatus] = useState('');

  useEffect(() => {
    switch (location.pathname) {
      case '/calendar/detail':
        setMenuStatus('원격진료 진료 현황');
        break;

      case '/schedule/detail':
        setMenuStatus('진료 스케줄 관리');
        break;

      default:
        break;
    }
  }, [location]);

  return (
    <>
      <Row>
        <Text T2 bold color={COLOR.GRAY3}>{menuStatus}</Text>
        <Image src={arrowIcon} width={32} marginLeft={10} />
        <Text T2 bold color={COLOR.MAIN} marginLeft={10}>진료 상세</Text>
      </Row>
    </>
  );
}

export default Calendar;

const CalendarContainer = styled.div`
  width: 100%;
  padding: 48px 0;
  display: flex;
  flex-direction: column;
`