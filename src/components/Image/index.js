//Styled Components
import styled from 'styled-components';

export const Image = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin-top: ${(props) => `${props.marginTop}px`};
  margin-left: ${(props) => `${props.marginLeft}px`};
  border-radius: ${(props) => props.borderRadius};
`;