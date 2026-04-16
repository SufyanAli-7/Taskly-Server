const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect("mongodb+srv://<username>:<password>@cluster.mongodb.net/taskly?retryWrites=true&w=majority")
        .then(() => {
            console.log('Connected to MongoDB');
        }).catch((err) => {
            console.error('Error connecting to MongoDB:', err);            
        });
}

module.exports = { connectDB };