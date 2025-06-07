import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the knowledge base
import knowledgeBase from '../dist/services/knowledgeBase.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/import-campus-data', async (req, res) => {
  try {
    console.log('🚀 Starting campus data import...');
    
    // Path to the data file
    const dataPath = path.join(__dirname, '..', 'data', 'campus_data.json');
    console.log(`📂 Reading file: ${dataPath}`);
    
    // Read and parse the file
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    console.log(`🔍 Found ${data.sections.length} sections to process...`);
    
    // Process each section
    for (const section of data.sections) {
      try {
        console.log(`\n📝 Processing: ${section.title} (${section.id})`);
        
        // Format the content
        let content = `# ${section.title}\n\n${section.content}\n\n`;
        
        if (section.location) {
          content += `**Location:** ${section.location}\n\n`;
        }
        
        if (section.hours) {
          content += '**Hours:**\n';
          for (const [day, time] of Object.entries(section.hours)) {
            content += `• ${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}\n`;
          }
          content += '\n';
        }
        
        if (section.contact?.phone || section.contact?.email) {
          content += '**Contact:**\n';
          if (section.contact.phone) content += `• Phone: ${section.contact.phone}\n`;
          if (section.contact.email) content += `• Email: ${section.contact.email}\n`;
          content += '\n';
        }
        
        // Add features if they exist
        if (section.features?.length) {
          content += '**Features:**\n';
          content += section.features.map(f => `• ${f}`).join('\n') + '\n\n';
        }
        
        // Add services if they exist
        if (section.services?.length) {
          content += '**Services:**\n';
          content += section.services.map(s => `• ${s}`).join('\n') + '\n\n';
        }
        
        // Generate keywords
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
          content: content.trim(),
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
    res.json({ success: true, message: `Successfully imported ${data.sections.length} campus locations` });
  } catch (error) {
    console.error('❌ Error in campus data import:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('Use POST /api/import-campus-data to import campus data');
});
