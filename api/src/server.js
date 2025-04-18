import dotenv from "dotenv";
import express from "express"
import { connectDB } from "./database/db.config.js";
import segmentRoute from "./routes/segment.route.js"
import cors from 'cors'

dotenv.config()
const app = express()
app.use(cors({
    origin: 'http://localhost:3000', // or '*' for all
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(express.json());const port = process.env.PORT || 8080;

app.use('/api/v1/segment', segmentRoute)
app.get('/health/', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    })
})