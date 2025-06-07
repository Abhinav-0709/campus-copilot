import { pool } from '../config/database';
import knowledgeBase from './knowledgeBase';
import dotenv from 'dotenv';

// Prevent client-side usage
const isServer = typeof window === 'undefined';
if (!isServer) {
  throw new Error('Database operations can only be performed on the server side');
}

dotenv.config();

// Initialize database tables
export async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Create responses table for FAQ and general responses
    await connection.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        response_text TEXT NOT NULL,
        response_type ENUM('general', 'department', 'facility', 'event') NOT NULL DEFAULT 'general',
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword (keyword)
      )
    `);

    // Create table for college departments
    await connection.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        head_of_department VARCHAR(255),
        contact_email VARCHAR(255),
        office_location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_department (name)
      )
    `);

    // Create table for campus facilities
    await connection.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        opening_hours TEXT,
        contact_info VARCHAR(255),
        image_url VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_facility (name)
      )
    `);

    // Create table for events
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATETIME NOT NULL,
        location VARCHAR(255),
        organizer VARCHAR(255),
        target_audience VARCHAR(255),
        registration_required BOOLEAN DEFAULT FALSE,
        registration_link VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX event_date_idx (event_date)
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        intent VARCHAR(100) NOT NULL,
        response_text TEXT NOT NULL,
        keywords JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create conversations table for chat history
    await connection.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL,
        user_message TEXT NOT NULL,
        bot_response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX session_idx (session_id)
      )
    `);

    // Insert some default responses if the table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM responses');
    // @ts-ignore
    if (rows[0].count === 0) {
      await insertDefaultResponses(connection);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Initialize the database when the application starts
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
}

// Insert default responses
export async function insertDefaultResponses(connection: any) {
  const defaultResponses = [
    {
      intent: 'greeting',
      response_text: 'Hello! How can I help you today?',
      keywords: JSON.stringify(['hi', 'hello', 'hey', 'greetings'])
    },
    {
      intent: 'farewell',
      response_text: 'Goodbye! Have a great day!',
      keywords: JSON.stringify(['bye', 'goodbye', 'see you', 'farewell'])
    },
    {
      intent: 'thanks',
      response_text: 'You\'re welcome! Is there anything else I can help you with?',
      keywords: JSON.stringify(['thanks', 'thank you', 'appreciate it'])
    },
    {
      intent: 'help',
      response_text: 'I can help you with information about courses, faculty, and campus facilities. What would you like to know?',
      keywords: JSON.stringify(['help', 'what can you do', 'how does this work'])
    }
  ];

  for (const response of defaultResponses) {
    await connection.query('INSERT INTO responses (intent, response_text, keywords) VALUES (?, ?, ?)', 
      [response.intent, response.response_text, response.keywords]);
  }
}

// Get response for user input
export async function getResponse(userInput: string): Promise<string> {
  if (!userInput?.trim()) {
    return 'I didn\'t catch that. Could you please rephrase your question?';
  }

  // First try to get a response from the knowledge base
  try {
    // Ensure knowledge base is initialized
    if (knowledgeBase) {
      const knowledgeBaseResponse = await knowledgeBase.query(userInput);
      if (knowledgeBaseResponse && 
          !knowledgeBaseResponse.answer.includes("I'm sorry, I don't have information about")) {
        return knowledgeBaseResponse.answer;
      }
    }
  } catch (error) {
    console.warn('Error querying knowledge base:', error);
    // Continue to database fallback
  }

  // If no response from knowledge base, try the database
  try {
    const connection = await pool.getConnection();
    
    try {
      // First try to find a response using JSON search
      const [rows] = await connection.query(
        `SELECT response_text 
         FROM responses 
         WHERE JSON_OVERLAPS(
           JSON_EXTRACT(keywords, '$[*]'), 
           CAST(? AS JSON)
         ) 
         LIMIT 1`,
        [JSON.stringify([userInput.toLowerCase()])]
      );

      // @ts-ignore
      if (rows.length > 0) {
        // @ts-ignore
        return rows[0].response_text;
      }


      // If no direct match, try keyword search
      const [keywordRows] = await connection.query(
        `SELECT response_text 
         FROM responses 
         WHERE EXISTS (
           SELECT 1 
           FROM JSON_TABLE(
             keywords, 
             '$[*]' COLUMNS(keyword VARCHAR(50) PATH '$')
           ) AS k 
           WHERE ? LIKE CONCAT('%', k.keyword, '%')
         )
         LIMIT 1`,
        [userInput.toLowerCase()]
      );

      // @ts-ignore
      if (keywordRows.length > 0) {
        // @ts-ignore
        return keywordRows[0].response_text;
      }
      
      // If no response found in database, fall back to knowledge base
      try {
        const fallbackResponse = await knowledgeBase.query(userInput);
        if (fallbackResponse) {
          return fallbackResponse.answer;
        }
      } catch (e) {
        console.warn('Error in knowledge base fallback:', e);
      }
      
      // Final fallback
      return "I'm sorry, I couldn't find a response to your query. Could you please rephrase or ask something else?";
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error when getting response:', error);
    
    // If database fails, try one last time with knowledge base
    try {
      const fallbackResponse = await knowledgeBase.query(userInput);
      if (fallbackResponse) {
        return fallbackResponse.answer;
      }
    } catch (e) {
      console.error('Knowledge base also failed:', e);
    }
    
    return 'I apologize, but I encountered an error processing your request. Please try again in a moment.';
  }
}

// Save conversation to database
export async function saveConversation(sessionId: string, userMessage: string, botResponse: string) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'INSERT INTO conversations (session_id, user_message, bot_response) VALUES (?, ?, ?)',
      [sessionId, userMessage, botResponse]
    );
  } catch (error) {
    console.error('Error saving conversation:', error);
  } finally {
    connection.release();
  }
}

