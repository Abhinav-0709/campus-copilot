import React from 'react';
import styled from 'styled-components';
import CampusCopilotChat from '../../components/CampusCopilotChat';
import { CollegeContext } from '../../types/college';
import collegeContext from '../../config/collegeContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    color: #3f51b5;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const ChatWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 70vh;
  min-height: 500px;
  max-height: 800px;
`;

const CampusCopilot: React.FC = () => {
  return (
    <PageContainer>
      <Header>
        <h1>Campus Copilot</h1>
        <p>Your AI assistant for {collegeContext.name}</p>
      </Header>
      
      <ChatWrapper>
        <CampusCopilotChat collegeContext={collegeContext} />
      </ChatWrapper>
      
      <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
        <p>Powered by Ollama AI</p>
      </div>
    </PageContainer>
  );
};

export default CampusCopilot;
