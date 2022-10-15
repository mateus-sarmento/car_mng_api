const express = require('express');
const mongoose = require('mongoose');
const routes = require('routes');
require('dotenv').config();
const cors = require('cors');

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

// enabling CORS for all requests
app.use(cors());
app.use(express.json());
app.use('/', routes)

app.listen(process.env.PORT || 3001)
