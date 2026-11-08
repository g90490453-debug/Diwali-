import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent wish storage for generated wishes
interface SavedWishRecord {
  id: string;
  name: string;
  sender?: string;
  theme: string;
  message?: string;
  senderToken: string;
  createdAt: number;
}

const wishesStore = new Map<string, SavedWishRecord>();

// Seed a couple of default sample wishes for verification
wishesStore.set('sample-rahul', {
  id: 'sample-rahul',
  name: 'Rahul',
  sender: 'Ankit & Family',
  theme: 'royal',
  message: 'May the majestic blessings of Goddess Lakshmi fill your kingdom of life with boundless wealth, royalty, good health, and eternal honor. Wishing you a glorious and Shubh Deepavali!',
  senderToken: 'token-admin-1',
  createdAt: Date.now(),
});

wishesStore.set('sample-priya', {
  id: 'sample-priya',
  name: 'Priya',
  sender: 'Sneha',
  theme: 'neon',
  message: 'Upgrading your festival to the future! May this Deepavali boost your energy levels, recharge your ambitions, and illuminate your path with next-gen joy and prosperity. Happy Cyber Diwali!',
  senderToken: 'token-admin-2',
  createdAt: Date.now(),
});

// Helper to generate short readable IDs
function generateWishId(): string {
  return crypto.randomBytes(4).toString('hex');
}

function generateSenderToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ==========================================
// BACKEND SECURITY & PERMISSIONS
// ==========================================

// Middleware: Sender Authorization Check
const verifySenderAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const isRecipientMode = req.headers['x-recipient-view'] === 'true' || req.query.view === 'recipient';
  if (isRecipientMode) {
    return res.status(403).json({
      error: 'Permission Denied',
      message: 'Recipients in view-only mode cannot perform administrative or wish creation actions.',
    });
  }
  next();
};

// 1. POST /api/wishes - Create new personalised wish (Sender only)
app.post('/api/wishes', verifySenderAccess, (req, res) => {
  const { name, sender, theme, message } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Recipient name is required.' });
  }

  const id = generateWishId();
  const senderToken = generateSenderToken();

  const record: SavedWishRecord = {
    id,
    name: name.trim(),
    sender: sender && typeof sender === 'string' ? sender.trim() : undefined,
    theme: theme && typeof theme === 'string' ? theme : 'royal',
    message: message && typeof message === 'string' ? message.trim() : undefined,
    senderToken,
    createdAt: Date.now(),
  };

  wishesStore.set(id, record);

  // Return the public view link and the sender token
  res.json({
    id,
    name: record.name,
    sender: record.sender,
    theme: record.theme,
    message: record.message,
    senderToken,
    shareUrl: `/wish?id=${id}&name=${encodeURIComponent(record.name)}&theme=${record.theme}`,
  });
});

// 2. GET /api/wishes/:id - Retrieve wish for Recipient or Sender
// Notice: senderToken is NEVER exposed to the recipient
app.get('/api/wishes/:id', (req, res) => {
  const { id } = req.params;
  const wish = wishesStore.get(id);

  if (!wish) {
    return res.status(404).json({ error: 'Wish not found.' });
  }

  const clientSenderToken = req.headers['x-sender-token'] as string | undefined;
  const isSender = clientSenderToken && clientSenderToken === wish.senderToken;

  res.json({
    id: wish.id,
    name: wish.name,
    sender: wish.sender,
    theme: wish.theme,
    message: wish.message,
    createdAt: wish.createdAt,
    // Permissions indicator: recipient is view-only
    canEdit: Boolean(isSender),
    isViewOnly: !isSender,
  });
});

// 3. GET /api/auth/verify - Verify role permissions
app.get('/api/auth/verify', (req, res) => {
  const isRecipientMode = req.headers['x-recipient-view'] === 'true' || req.query.view === 'recipient';
  res.json({
    role: isRecipientMode ? 'recipient' : 'sender',
    canCreate: !isRecipientMode,
    canEdit: !isRecipientMode,
  });
});

// Mount Vite in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
