import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the environment variables
const envVars = `VITE_CHROMA_DB_URL=http://localhost:8000
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama3
`;

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
try {
  await fs.access(envPath);
  console.log('.env file already exists');
} catch (error) {
  await fs.writeFile(envPath, envVars);
  console.log('.env file created successfully');
}

// Update package.json to use tsx with --env-file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

// Update scripts to include --env-file
const scripts = packageJson.scripts || {};
scripts['process-docs'] = 'tsx --env-file=.env src/scripts/processDocuments.ts';
scripts['test-docs'] = 'tsx --env-file=.env src/scripts/testDocumentProcessing.ts';

// Write the updated package.json
await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json updated successfully');

console.log('\nSetup complete! Please run the following commands in order:');
console.log('1. Make sure Ollama is running: ollama serve');
console.log('2. npm install');
console.log('3. npm run process-docs');
console.log('4. npm run test-docs');

// Make the script runnable
setup().catch(console.error);

async function setup() {
  // The setup logic is now handled by the async/await pattern above
}
