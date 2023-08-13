//React
import { useEffect, useState, useContext } from 'react';
import { Context } from 'context';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

//Components
import { COLOR } from 'constants/design';
import { Text } from 'components/Text';
import { Image } from 'components/Image';
import { Row, FlexBox, DividingLine } from 'components/Flex';

function Calendar() {

  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <CalendarContainer>
      캘린더

    </CalendarContainer>
  );
}

export default Calendar;

const CalendarContainer = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
`