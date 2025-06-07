import { readFile } from 'fs/promises';
import path from 'path';
import knowledgeBase from './knowledgeBase';

interface CampusSection {
  id: string;
  title: string;
  content: string;
  hours?: Record<string, string>;
  location?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  features?: string[];
  services?: string[];
  permit_types?: string[];
}

interface CampusData {
  name: string;
  last_updated: string;
  sections: CampusSection[];
}

/**
 * Format hours object into a readable string
 */
function formatHours(hours: Record<string, string> | undefined): string {
  if (!hours) return '';
  
  return Object.entries(hours)
    .map(([day, time]) => `• ${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
    .join('\n');
}

/**
 * Format features/services into a bulleted list
 */
function formatList(items: string[] | undefined): string {
  if (!items || items.length === 0) return '';
  return items.map(item => `• ${item}`).join('\n');
}

/**
 * Process a single campus section into a knowledge base entry
 */
function processSection(section: CampusSection): string {
  let entry = `# ${section.title}\n\n${section.content}\n\n`;
  
  if (section.location) {
    entry += `**Location:** ${section.location}\n\n`;
  }
  
  const hours = formatHours(section.hours);
  if (hours) {
    entry += `**Hours:**\n${hours}\n\n`;
  }
  
  if (section.contact?.phone || section.contact?.email) {
    entry += '**Contact:**\n';
    if (section.contact.phone) entry += `• Phone: ${section.contact.phone}\n`;
    if (section.contact.email) entry += `• Email: ${section.contact.email}\n`;
    entry += '\n';
  }
  
  if (section.features?.length) {
    entry += `**Features:**\n${formatList(section.features)}\n\n`;
  }
  
  if (section.services?.length) {
    entry += `**Services:**\n${formatList(section.services)}\n\n`;
  }
  
  if (section.permit_types?.length) {
    entry += `**Permit Types:**\n${formatList(section.permit_types)}\n\n`;
  }
  
  return entry.trim();
}

/**
 * Import campus data from a JSON file
 */
export async function importCampusData(filePath: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🚀 Starting campus data import...');
    
    // Wait for knowledge base to be ready
    await knowledgeBase.readyPromise;
    
    if (!knowledgeBase.isReady) {
      throw new Error('Knowledge base is not ready');
    }
    
    console.log('📂 Reading file:', filePath);
    const fileContent = await readFile(filePath, 'utf-8');
    const data: CampusData = JSON.parse(fileContent);
    
    console.log(`🔍 Found ${data.sections.length} sections to process...`);
    
    const entries = data.sections.map(section => {
      const content = processSection(section);
      const keywords = [
        section.title.toLowerCase(),
        section.id,
        ...(section.title.includes(' ') ? section.title.split(' ').map(w => w.toLowerCase()) : [])
      ].filter((value, index, self) => self.indexOf(value) === index);
      
      return {
        content,
        keywords,
        category: 'campus_info',
        source: `campus_data:${section.id}`,
        metadata: {
          id: section.id,
          title: section.title,
          last_updated: data.last_updated
        }
      };
    });
    
    // Add all entries to the knowledge base
    knowledgeBase.addEntries(entries);
    
    console.log(`✅ Successfully imported ${entries.length} entries`);
    return {
      success: true,
      message: `Successfully imported ${entries.length} campus locations`
    };
  } catch (error) {
    console.error('❌ Error importing campus data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
