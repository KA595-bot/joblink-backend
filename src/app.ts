import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { config } from 'dotenv';
import { serve } from 'inngest/express';

config();

import { connectDB } from './config/database';
import { inngest } from './config/inngest';
import authRoutes from './routes/auth.route';
import { sendOtpEmail } from './jobs/sendOtpEmail';

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

 app.use('/api/inngest', serve({
    client: inngest,
    functions: [sendOtpEmail], // Pass the imported function(s) here
}));

// Health check route (for manual testing)
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), inngest: true });
});

// Auth routes - FIXED: Added leading slash
app.use('/v1/api/auth', authRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`🔗 Inngest endpoint: http://localhost:${PORT}/api/inngest`); // For debugging
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;