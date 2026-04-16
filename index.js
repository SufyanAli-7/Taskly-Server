const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const auth = require('./routes/auth');

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




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});