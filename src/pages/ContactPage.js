import React from 'react';
import styled from 'styled-components';
import Contact from '../components/Contact';

const ContactPageSection = styled.div`
  margin: 0;
  padding: 0;
`;

const ContactPage = () => {
  return (
    <ContactPageSection>
      <Contact />
    </ContactPageSection>
  );
};

export default ContactPage; 