import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #4a6163;
    --secondary-color: #4a6163;
    --accent-color: #5d7a7c;
    --background-color: #f5f5f5;
    --text-color: #333;
    --white: #ffffff;
    --black: #000000;
    --gray-light: #e0e0e0;
    --gray: #9e9e9e;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --button-radius: 25px;
    --button-padding: 0.5rem 1.5rem;
    --hover-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-color);
    }
  }

  button {
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  section {
    padding: 4rem 0;
  }

  @media (max-width: 768px) {
    section {
      padding: 2rem 0;
    }
  }
`;

export default GlobalStyles; 