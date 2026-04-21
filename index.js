const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const auth = require('./routes/auth');
const todos = require('./routes/todos');
const dotenv = require('dotenv');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

connectDB();



app.get('/', (req, res) => {
    const date = new Date().toLocaleString();
    res.send(`Hello! Today's date is ${date}`);
});

app.get('/health', (req, res) => {
    res.send('OK');
});


app.use('/auth', auth);
app.use('/todos', todos);




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});