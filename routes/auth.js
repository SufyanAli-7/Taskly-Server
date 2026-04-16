const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/auth');

const router = express.Router();


router.post('/register', async (req, res) => {
    try {

        const { fullName, email, password } = req.body;

        const user = await Users.findOne( { email } );
        if (user) {
            return res.status(401).json({ message: 'User already exists', isError: true });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const uid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

        const newUserData = { uid, fullName, email, password: hashedPassword }

        const newUser = new Users(newUserData);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error', isError: true });
    }

});


module.exports = router;