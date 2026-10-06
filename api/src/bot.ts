// Starts the real thing: the API plus a live WhatsApp connection (npm run bot).
// The environment variable is set before the app loads so the Baileys adapter is the one selected.
process.env.WHATSAPP_ADAPTER = 'baileys';
await import('./main.js');
