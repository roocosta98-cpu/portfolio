import fs from 'fs';
import path from 'path';

const logPath = 'C:\\Users\\rooco\\.gemini\\antigravity\\brain\\1622809e-26ab-42c9-ae5f-03297f42daf1\\.system_generated\\logs\\transcript.jsonl';

function search() {
  if (!fs.existsSync(logPath)) {
    console.log('Log file does not exist at:', logPath);
    return;
  }

  const content = fs.readFileSync(logPath, 'utf-8');
  const lines = content.split('\n');
  console.log(`Searching ${lines.length} lines of logs...`);
  
  for (const line of lines) {
    if (line.includes('db.gcozhjuljappdlvjweuy') || line.includes('postgresql://')) {
      console.log('MATCH:', line.slice(0, 1000));
    }
  }
}

search();
