import React from 'react'
import lolpng from '../assets/lolpng.png'

import styled from 'styled-components';

import theme from '../style/theme'
import mixins from '../style/mixins'

const { colors, fonts } = theme;


const StyledContainer = styled.div`
  ${mixins.flexCenter};
  background-color: ${colors.black};
  background-image: linear-gradient(${colors.black} 0%, ${colors.darkGrey} 100%);
  color: ${colors.offWhite};
  height: 100vh;

  form {
    background-color: transparent;
    border-radius: 5px;
    padding: 2rem;
    margin-bottom: 20vh;
    max-width: 600px;
    text-align: center;
    svg {
      color: ${colors.blue};
    }
    label {
      display: block;
      font-size: 2.5rem;
      font-weight: 500;
      margin: 2rem;
    }
    input {
      background-color: #26303c;
      outline: 0;
      border: 0;
      border-radius: 0.25rem;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      padding: 1rem;
      color: ${colors.lightblue};
      font-family: ${fonts.mono};
      font-size: 2rem;
      font-weight: 400;
      text-align: center;
    }

    .submit {
      ${mixins.blueButton};
      margin-top: 3rem;
      filter: none;
    }
  }
`;

//https://chakra-ui.com/button recommended for nice styling

const EnterName = (props) => {
    
    return (
      <main>
        <StyledContainer>
          <form onSubmit={props.handleSubmit}>
              <label>
                  <img src={lolpng} alt='LeagueLogo'/>
                  <label htmlFor="username">Enter League of Legends Username:</label>
                  <input type="text" name="name" placeholder="Input Here - try 'huhi'" spellCheck="false" onChange={props.onChange}/>
              </label>
                  <input type="submit" value="Submit" />
          </form>
        </StyledContainer>
      </main>
    )
}

export default EnterName;
