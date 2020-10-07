import React from 'react';
import styled from 'styled-components';
import theme from '../style/theme';
import mixins from '../style/mixins';
import media from '../style/media';
const { colors } = theme;

const StyledFooter = styled.footer`
  ${mixins.flexCenter};
  padding: 2rem 5rem;
  color: ${colors.grey};
  text-align: center;
  font-weight: 500;
  font-size: 14px;

  ${media.bp900`
    padding: 2rem;
  `};
  ${media.bp400`
    padding: 1rem;
  `};

  a {
    padding: 5px;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const Footer = () => (
  <StyledFooter>
    <div>
      <span>Built with</span>
      <a href="https://www.chartjs.org/" target="_blank" rel="noopener noreferrer">
        Chart.js
      </a>
      &middot;
      <a
        href="https://developer.riotgames.com/"
        target="_blank"
        rel="noopener noreferrer">
        League API
      </a>
      &middot;
      <a href="https://www.styled-components.com/" target="_blank" rel="noopener noreferrer">
        Styled Components
      </a>
      &middot;
      <a
        href="https://github.com/joshwcomeau/react-flip-move"
        target="_blank"
        rel="noopener noreferrer">
        React Flip Move
      </a>
      and more!
    </div>
  </StyledFooter>
);

export default Footer;
