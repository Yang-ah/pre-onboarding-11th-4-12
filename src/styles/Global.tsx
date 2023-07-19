import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  input {
    border: none;
    outline: none;
  }

  ul,li {
    list-style:none;  
  }

  a {
    outline: none;
    text-decoration: none;
    color: inherit;
  }
`;
