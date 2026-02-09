import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

dotenv.config();

connectDB();

const app = express();

import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoute);
app.use('/posts', postRoute);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error occurred',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`);
});