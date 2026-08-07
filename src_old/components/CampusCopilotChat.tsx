import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSend } from 'react-icons/fi';
import { Message } from '../types/college';
import CampusCopilot from '../services/campusCopilot';
import { CollegeContext } from '../types/college';

interface CampusCopilotChatProps {
  collegeContext: CollegeContext;
  className?: string;
}

// Animations
const typingAnimation = keyframes`
  0% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: 0.4; transform: translateY(0); }
`;

// Styled Components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MessageBubble = styled.div<{ $isUser?: boolean }>`
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: ${props => props.$isUser ? '#3f51b5' : '#f0f0f0'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
  line-height: 1.4;
  animation: ${props => !props.$isUser ? 'fadeIn 0.3s ease' : 'none'};
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const InputContainer = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #fff;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3f51b5;
  }
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  padding: 0 1.25rem;
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: #303f9f;
  }
  
  &:disabled {
    background: #b0b0b0;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  
  span {
    width: 8px;
    height: 8px;
    background-color: #666;
    border-radius: 50%;
    display: inline-block;
    animation: ${typingAnimation} 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: #666;
  font-size: 0.9rem;
  
  h3 {
    margin: 0 0 0.5rem;
    color: #333;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0.25rem 0;
  }
`;

const CampusCopilotChat: React.FC<CampusCopilotChatProps> = ({ collegeContext, className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const campusCopilot = useRef<CampusCopilot>();
  const initialLoad = useRef(true);

  // Initialize CampusCopilot
  useEffect(() => {
    campusCopilot.current = new CampusCopilot(collegeContext);
    
    // Add welcome message only if there are no messages
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: `Hello! I'm your Campus Copilot at ${collegeContext.name}. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [collegeContext, messages.length]);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userMessage = inputValue.trim();
    if (!userMessage || !campusCopilot.current) return;
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setHasInteracted(true);
    
    try {
      // Get response from CampusCopilot
      const response = await campusCopilot.current.handleQuery(userMessage);
      
      // Add bot response
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'bot',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContainer className={className}>
      <MessagesContainer>
        {messages.length === 0 ? (
          <WelcomeMessage>
            <h3>Welcome to Campus Copilot</h3>
            <p>Ask me anything about {collegeContext.name}!</p>
            <p>Try asking about departments, facilities, or upcoming events.</p>
          </WelcomeMessage>
        ) : (
          messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              $isUser={message.sender === 'user'}
              style={message.isError ? { color: '#d32f2f', backgroundColor: '#ffebee' } : {}}
            >
              {message.text}
            </MessageBubble>
          ))
        )}
        {isTyping && (
          <MessageBubble $isUser={false}>
            <TypingIndicator>
              <span></span>
              <span></span>
              <span></span>
            </TypingIndicator>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isTyping}
        />
        <SendButton 
          type="submit" 
          disabled={!inputValue.trim() || isTyping}
          aria-label="Send message"
        >
          <FiSend />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default CampusCopilotChat;
