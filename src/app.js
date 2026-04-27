const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const charactersRouter = require('./routes/characters-routes');
app.use('/characters', charactersRouter);

require('./dao/mongoose/connection').connect_mongoose();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
})
