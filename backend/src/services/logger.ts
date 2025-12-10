import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH);

export function logAriesFallback(prompt, err) {
  const line = `[${new Date().toISOString()}] AriesFail: ${prompt.slice(0,80)} | ${err.message}\n`;
  fs.appendFileSync(path.join(LOG_PATH, "aries_fallback.log"), line);
}
