import fs from 'fs';

const logPath = 'C:\\Users\\rooco\\.gemini\\antigravity\\brain\\1622809e-26ab-42c9-ae5f-03297f42daf1\\.system_generated\\logs\\transcript.jsonl';

function search() {
  if (!fs.existsSync(logPath)) {
    console.log('Log file does not exist.');
    return;
  }

  const content = fs.readFileSync(logPath, 'utf-8');
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('password') || line.includes('Client') || line.includes('Client(') || line.includes('Fmfm') || line.includes('10131427')) {
      console.log(`[Line ${i}]:`, line.slice(0, 500));
    }
  }
}

search();
