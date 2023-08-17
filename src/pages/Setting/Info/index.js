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

  return (
    <>
      <Text T2 bold>개인정보</Text>
      <Row>
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