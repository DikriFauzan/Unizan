import express from 'express';
import cors from 'cors';
import { apiKeyGuard, billTokens } from './middleware/apiKeyGuard';
import { routeAI } from './services/aiRouter';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Root Health Check
app.get('/', (req, res) => res.json({ 
    status: 'online', 
    system: 'FEAC Sovereign Core v7.0',
    mode: 'production' 
}));

// AI Endpoint
app.post('/v1/ai/chat', apiKeyGuard, billTokens('CHAT'), async (req, res) => {
    const { messages } = req.body;
    const lastMsg = messages[messages.length - 1].content;
    const response = await routeAI(lastMsg, {}, (req as any).user);
    res.json(response);
});

// Build Endpoint
app.post('/v1/build/apk', apiKeyGuard, billTokens('BUILD_APK'), async (req, res) => {
    res.json({ jobId: 'job_' + Date.now(), status: 'queued', note: 'Worker dispatched' });
});

app.listen(PORT, () => {
    console.log(`[FEAC] Core Active on port ${PORT}`);
    console.log(`[FEAC] Internal SuperKey Loaded.`);
});
