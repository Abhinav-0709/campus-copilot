interface FAQItem {
  question: string | RegExp;
  answer: string | ((context: any, match?: RegExpMatchArray | null) => string);
  priority?: number; // Higher number = higher priority
  tags?: string[]; // For better categorization
}

export class FAQService {
  private faqCache = new Map<string, string>();
  private context: any;
  private faqs: FAQItem[] = [];

  constructor(context: any) {
    this.context = context;
    this.initializeFAQs();
  }

  private initializeFAQs() {
    this.faqs = [
      // Leave Application
      {
        question: /\b(how\s+)?(do|can|could)\s+(i|we)\s+(apply|submit|request)\s+(a|for\s+leave|leave\s+application)/i,
        answer: () => {
          // Check if we have leave policy in context
          if (this.context.leavePolicy) {
            return this.context.leavePolicy;
          }
          // Fallback to general information
          return `To apply for leave at ${this.context.name}:
1. Log in to the student portal
2. Navigate to the 'Leave Application' section
3. Fill out the required details
4. Submit the application

For emergency leaves, please contact your department office directly.`;
        },
        priority: 5,
        tags: ['leave', 'application', 'procedure']
      },
      
      // Greetings
      {
        question: /\b(hi|hello|hey|greetings?|what's up|yo)\b/i,
        answer: () => `Hello! I'm your Campus Copilot at ${this.context.name}. How can I assist you today?`,
        priority: 10,
        tags: ['greeting']
      },
      
      // Department Information
      {
        question: /\b(?:who is the head of (?:the )?(.+?)(?: department| dept)?|(?:head|HOD) of (?:the )?(.+?)(?: department| dept)?)\b/i,
        answer: (_, match) => {
          const deptName = (match?.[1] || match?.[2] || '').toLowerCase();
          const dept = this.context.departments?.find((d: any) => 
            d.name.toLowerCase().includes(deptName) || 
            deptName.includes(d.name.toLowerCase().split(' ')[0])
          );
          return dept?.head 
            ? `The head of ${dept.name} department is ${dept.head}.` + 
              (dept.email ? ` You can contact them at ${dept.email}` : '')
            : `I couldn't find information about the ${deptName} department. Could you please specify the department name?`;
        },
        priority: 8,
        tags: ['department', 'contact']
      },

      // Contact Information
      {
        question: /\b(?:contact|email|phone|address|how to reach|where is|location)\b/i,
        answer: () => {
          const { contactInfo } = this.context;
          if (!contactInfo) return "I don't have contact information available.";
          
          let response = "Here's how to reach us:\n";
          if (contactInfo.general?.email) response += `📧 Email: ${contactInfo.general.email}\n`;
          if (contactInfo.general?.phone) response += `📞 Phone: ${contactInfo.general.phone}\n`;
          if (contactInfo.general?.address) response += `📍 Address: ${contactInfo.general.address}\n`;
          
          return response || "I couldn't find any contact information.";
        },
        priority: 7,
        tags: ['contact', 'location']
      },

      // Facilities
      {
        question: /\b(?:where is|location of|how to get to|directions to|find)\s+(.+?)(?:\?|$)/i,
        answer: (_, match) => {
          const query = match?.[1]?.toLowerCase() || '';
          const facility = this.context.facilities?.find((f: any) => 
            f.name.toLowerCase().includes(query) || 
            query.includes(f.name.toLowerCase().split(' ')[0])
          ) || this.context.sections?.find((s: any) => 
            s.title.toLowerCase().includes(query) ||
            query.includes(s.title.toLowerCase().split(' ')[0])
          );

          if (!facility) {
            return `I couldn't find information about ${query}. Could you be more specific?`;
          }

          let response = `📍 ${facility.title || facility.name}`;
          if (facility.location) response += `\nLocation: ${facility.location}`;
          if (facility.hours) {
            response += `\nHours: ${Object.entries(facility.hours)
              .map(([day, time]) => `${day}: ${time}`)
              .join('\n       ')}`;
          }
          return response;
        },
        priority: 6,
        tags: ['facility', 'location']
      }
    ];
  }

  public findAnswer(query: string): string | null {
    // Check cache first
    const cacheKey = query.trim().toLowerCase();
    if (this.faqCache.has(cacheKey)) {
      return this.faqCache.get(cacheKey) || null;
    }

    // Find matching FAQ
    const matches = this.faqs
      .map(faq => {
        if (typeof faq.question === 'string') {
          return query.toLowerCase().includes(faq.question.toLowerCase()) 
            ? { faq, match: null } 
            : null;
        } else {
          const match = query.match(faq.question);
          return match ? { faq, match } : null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b?.faq.priority || 0) - (a?.faq.priority || 0));

    const bestMatch = matches[0];
    if (!bestMatch) return null;

    const answer = typeof bestMatch.faq.answer === 'function'
      ? bestMatch.faq.answer(this.context, bestMatch.match)
      : bestMatch.faq.answer;

    // Cache the answer
    this.faqCache.set(cacheKey, answer);
    return answer;
  }

  public addFAQ(question: string | RegExp, answer: string | ((context: any) => string), priority: number = 5, tags: string[] = []) {
    this.faqs.push({ question, answer, priority, tags });
    // Clear cache when adding new FAQs
    this.faqCache.clear();
  }
}

export const createFAQService = (context: any) => new FAQService(context);