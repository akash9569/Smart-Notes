import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Export the path and a CID for Nodemailer to attach the logo inline
export const logoPath = join(__dirname, '..', '..', '..', 'frontend', 'public', 'logo.png');
export const logoCid = 'smart-notes-logo';
