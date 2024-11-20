const express = require('express');
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
const cors = require('cors');

dotenv.config();
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};

app.use(cors(corsOptions)); 

app.use(express.json());

app.use('/api', userRoutes);

// test route
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ message: "OK" });
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});