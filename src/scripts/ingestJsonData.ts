import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import knowledgeBase from '../services/knowledgeBase'; // Default import for the singleton instance

// Get the current file's directory
const __filename = fileURLToPath(import.meta?.url || '');
const __dirname = path.dirname(__filename);

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
  
  if (section.features && section.features.length > 0) {
    entry += `**Features:**\n${formatList(section.features)}\n\n`;
  }
  
  if (section.services && section.services.length > 0) {
    entry += `**Services:**\n${formatList(section.services)}\n\n`;
  }
  
  if (section.permit_types && section.permit_types.length > 0) {
    entry += `**Permit Types:**\n${formatList(section.permit_types)}\n\n`;
  }
  
  return entry.trim();
}

/**
 * Main function to process the JSON file and add to knowledge base
 */
async function main() {
  try {
    console.log('🚀 Starting JSON data ingestion...');
    
    // Path to the JSON file
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'data',
      'campus_data.json'
    );
    
    console.log(`📂 Reading file: ${filePath}`);
    const fileContent = await readFile(filePath, 'utf-8');
    const data: CampusData = JSON.parse(fileContent);
    
    console.log(`🔍 Found ${data.sections.length} sections to process...`);
    
    // Wait for knowledge base to be ready
    console.log('⏳ Waiting for knowledge base to be ready...');
    await knowledgeBase.readyPromise;
    
    if (!knowledgeBase.isReady) {
      throw new Error('Knowledge base failed to initialize');
    }
    console.log('✅ Knowledge base is ready');
    
    // Process each section and add to knowledge base
    for (const section of data.sections) {
      try {
        console.log(`\n📝 Processing: ${section.title} (${section.id})`);
        
        const content = processSection(section);
        const keywords = [
          section.title.toLowerCase(),
          section.id,
          ...(section.title.includes(' ') ? section.title.split(' ').map(w => w.toLowerCase()) : [])
        ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        
        // Create entry
        const entry = {
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
        
        console.log(`📥 Adding entry for: ${section.title}`);
        console.log(`📊 Content length: ${content.length} characters`);
        console.log(`🏷️  Keywords: ${keywords.join(', ')}`);
        
        // Add to knowledge base
        knowledgeBase.addEntries([entry]);
        
        console.log(`✅ Successfully added: ${section.title}`);
      } catch (error) {
        console.error(`❌ Error processing section ${section.id}:`, error);
      }
    }
    
    console.log('\n🎉 Successfully processed all sections!');
    console.log('🏁 Data ingestion complete');
    
    // Keep the process alive for a moment to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  } catch (error) {
    console.error('❌ Error in JSON data ingestion:', error);
    process.exit(1);
  }
}

// Run the main function
main();
