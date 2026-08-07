import { CollegeContext } from '../types/college';
import { FAQService } from './faqService';
import aiService from './aiService';
import campusData from '../../data/campus_data.json';

export class CampusCopilot {
  private faqService: FAQService;
  private context: CollegeContext;
  private systemPrompt: string;
  private campusData: any;

  constructor(context: CollegeContext) {
    this.context = context;
    this.campusData = campusData;
    this.faqService = new FAQService({
      ...context,
      sections: campusData.sections // Add campus data sections to context
    });
    
    this.systemPrompt = `You are a helpful AI assistant for ${context.name} campus. 
      Your name is Campus Copilot. Be friendly, professional, and concise in your responses.
      
      College Information:
      - Name: ${context.name}
      - Departments: ${context.departments?.map(d => d.name).join(', ') || 'Not specified'}
      - Main Contact: ${context.contactInfo?.general?.email || 'Not available'}
      
      You have access to detailed information about campus facilities, departments, and services.
      If you don't know the answer, say you don't know or ask for clarification.`;
  }

  public async handleQuery(userQuery: string): Promise<string> {
    // Handle empty query
    if (!userQuery.trim()) {
      return "I'm sorry, I didn't catch that. Could you please rephrase your question?";
    }

    const lowerQuery = userQuery.toLowerCase();
    
    // Handle attendance queries directly
    if (lowerQuery.includes('attendance') || lowerQuery.includes('present')) {
      try {
        const studentData = this.context.studentData;
        if (studentData?.attendance) {
          const { attendance } = studentData;
          const subjectDetails = attendance.by_subject
            .map(sub => 
              `${sub.name}: ${sub.percentage}% (${sub.attended}/${sub.total} classes)`
            )
            .join('\n');
          
          return `Here's your attendance summary:\n\n` +
                 `📊 Overall: ${attendance.overall_percentage}%\n\n` +
                 `📚 By subject:\n${subjectDetails}`;
        }
        return "I couldn't find your attendance records. Please try again later.";
      } catch (error) {
        console.error('Error fetching attendance:', error);
        return "I'm having trouble fetching your attendance data at the moment. Please try again later.";
      }
    }

    // Try to get answer from FAQ first
    const faqAnswer = this.faqService.findAnswer(userQuery);
    if (faqAnswer) {
      return faqAnswer;
    }

    // If no FAQ match, use the AI service
    return this.generateAIResponse(userQuery);
  }

  private async generateAIResponse(query: string): Promise<string> {
    try {
      // Create a context string for the prompt
      const context = this.formatContextForPrompt();
      
      const prompt = `User asked: "${query}"

Context about ${this.context.name}:
${context}

Please provide a helpful and concise response. If the information isn't available in the context, say you don't know.`;

      return await aiService.generateResponse(prompt, this.systemPrompt);
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  }

  private formatContextForPrompt(): string {
    const { departments, facilities, upcomingEvents, contactInfo } = this.context;
    
    let context = '';
    
    // Add department information
    if (departments?.length) {
      context += `\nDepartments:\n${departments.map((d: any) => 
        `- ${d.name}: ${d.about || 'No description'}` +
        (d.head ? `\n  Head: ${d.head}` : '') +
        (d.email ? `\n  Email: ${d.email}` : '') +
        (d.location ? `\n  Location: ${d.location}` : '')
      ).join('\n')}`;
    }
    
    // Add facilities information
    const allFacilities = [
      ...(facilities || []),
      ...(this.campusData.sections || [])
    ];
    
    if (allFacilities.length) {
      context += '\n\nFacilities and Services:';
      allFacilities.forEach((f: any) => {
        context += `\n- ${f.title || f.name}: ${f.content || f.description || 'No description'}`;
        if (f.location) context += `\n  Location: ${f.location}`;
        if (f.hours) {
          context += '\n  Hours: ' + Object.entries(f.hours || {})
            .map(([day, time]) => `${day}: ${time}`)
            .join(', ');
        }
        if (f.contact) {
          const contact = f.contact;
          const contactInfo = [];
          if (contact.email) contactInfo.push(`Email: ${contact.email}`);
          if (contact.phone) contactInfo.push(`Phone: ${contact.phone}`);
          if (contactInfo.length) context += `\n  Contact: ${contactInfo.join(', ')}`;
        }
      });
    }
    
    // Add upcoming events
    if (upcomingEvents?.length) {
      const now = new Date();
      const futureEvents = upcomingEvents
        .filter((e: any) => new Date(e.date) > now)
        .slice(0, 5);
      
      if (futureEvents.length) {
        context += '\n\nUpcoming Events:';
        futureEvents.forEach((event: any) => {
          context += `\n- ${event.title} (${new Date(event.date).toLocaleDateString()})`;
          if (event.location) context += ` at ${event.location}`;
          if (event.description) context += ` - ${event.description}`;
        });
      }
    }
    
    // Add contact information
    if (contactInfo) {
      context += '\n\nContact Information:';
      Object.entries(contactInfo).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object') {
            context += `\n- ${key.charAt(0).toUpperCase() + key.slice(1)}:`;
            Object.entries(value as object).forEach(([subKey, subValue]) => {
              if (subValue) context += `\n  - ${subKey}: ${subValue}`;
            });
          } else {
            context += `\n- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
          }
        }
      });
    }
    
    return context || 'No additional context available.';
  }
}

export default CampusCopilot;