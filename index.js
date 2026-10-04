const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const auth = require('./routes/auth');
const todos = require('./routes/todos');


const app = express();

app.use(cors());
app.use(express.json());

connectDB().catch((err) => console.error('Initial DB connection error:', err));

// Ensure MongoDB is connected before handling any incoming request (crucial for serverless cold starts)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection middleware error:', err);
        res.status(500).json({ message: 'Database connection error', isError: true });
    }
});

app.get('/', (req, res) => {
    const date = new Date().toLocaleString();
    res.send(`Hello! Today's date is ${date}`);
});

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/auth', auth);
app.use('/todos', todos);

// Start server locally / on traditional servers (skip listen on Vercel serverless functions)
const PORT = process.env.PORT || 8000;
if (process.env.VERCEL !== '1' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;