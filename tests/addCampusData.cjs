// Simple script to add campus data to the knowledge base
const fs = require('fs').promises;
const path = require('path');

// Import the knowledge base instance
const knowledgeBase = require('./dist/services/knowledgeBase');

// Path to the campus data file
const CAMPUS_DATA_PATH = path.join(__dirname, 'data', 'campus_data.json');

// Format hours object into a readable string
function formatHours(hours) {
  if (!hours) return '';
  return Object.entries(hours)
    .map(([day, time]) => `• ${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
    .join('\n');
}

// Format features/services into a bulleted list
function formatList(items) {
  if (!items || items.length === 0) return '';
  return items.map(item => `• ${item}`).join('\n');
}

// Process a single campus section into a knowledge base entry
function processSection(section) {
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
  
  if (section.features?.length > 0) {
    entry += `**Features:**\n${formatList(section.features)}\n\n`;
  }
  
  if (section.services?.length > 0) {
    entry += `**Services:**\n${formatList(section.services)}\n\n`;
  }
  
  if (section.permit_types?.length > 0) {
    entry += `**Permit Types:**\n${formatList(section.permit_types)}\n\n`;
  }
  
  return entry.trim();
}

async function main() {
  try {
    console.log('🚀 Starting to add campus data...');
    
    // Read the campus data file
    console.log(`📂 Reading file: ${CAMPUS_DATA_PATH}`);
    const fileContent = await fs.readFile(CAMPUS_DATA_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    
    console.log(`🔍 Found ${data.sections.length} sections to process...`);
    
    // Wait for knowledge base to be ready
    console.log('⏳ Waiting for knowledge base to be ready...');
    await knowledgeBase.readyPromise;
    
    if (!knowledgeBase.isReady) {
      throw new Error('Knowledge base failed to initialize');
    }
    console.log('✅ Knowledge base is ready');
    
    // Process each section
    for (const section of data.sections) {
      try {
        console.log(`\n📝 Processing: ${section.title} (${section.id})`);
        
        const content = processSection(section);
        const keywords = [
          section.title.toLowerCase(),
          section.id,
          ...(section.title.includes(' ') ? section.title.split(' ').map(w => w.toLowerCase()) : [])
        ].filter((value, index, self) => self.indexOf(value) === index);
        
        console.log(`📥 Adding entry for: ${section.title}`);
        console.log(`📊 Content length: ${content.length} characters`);
        console.log(`🏷️  Keywords: ${keywords.join(', ')}`);
        
        // Add to knowledge base
        knowledgeBase.addEntries([{
          content,
          keywords,
          category: 'campus_info',
          source: `campus_data:${section.id}`,
          metadata: {
            id: section.id,
            title: section.title,
            last_updated: data.last_updated
          }
        }]);
        
        console.log(`✅ Successfully added: ${section.title}`);
      } catch (error) {
        console.error(`❌ Error processing section ${section.id}:`, error.message);
      }
    }
    
    console.log('\n🎉 Successfully processed all sections!');
    console.log('🏁 Data ingestion complete');
    
    // Keep the process alive for a moment to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  } catch (error) {
    console.error('❌ Error in campus data ingestion:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
