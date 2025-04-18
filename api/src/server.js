import dotenv from "dotenv";
import express from "express"
import { connectDB } from "./database/db.config.js";
import segmentRoute from "./routes/segment.route.js"
import cors from 'cors'
import { errorHandler, notFound } from './middlewares/error.middleware.js';

dotenv.config()
const app = express()
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); const port = process.env.PORT || 8080;

app.use('/api/v1/segment', segmentRoute)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
})