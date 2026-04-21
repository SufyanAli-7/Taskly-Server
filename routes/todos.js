const express = require('express');
const multer = require('multer');
const { verifyToken } = require('../middlewares/auth');
const Todos = require('../models/Todos');
const getRandomId = require('../config/global');
const cloudinary = require('../config/cloudinary');


const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/create', verifyToken, upload.fields([{ name: 'image'}]), async (req, res) => {

    try {
        const { title, dueDate, description, priority } = req.body;
        const { uid } = req;
        const id = getRandomId();

        let imageURL = ''; imagePublicId = '';
        if (req.files['image'] && req.files['image'][0]) {
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'images/' },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        imageURL = result.secure_url
                        imagePublicId = result.public_id
                        resolve();
                    })
                uploadStream.end(req.files['image'][0].buffer);
            })
        }

        const todoData = { id, uid, title, dueDate, description, priority, imageURL, imagePublicId };

        const todo = new Todos(todoData);
        await todo.save();

        res.status(201).json({ message: 'Todo created successfully', todo });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

})

router.get('/all', verifyToken, async (req, res) => {
    try {
        const { uid } = req;
        const todos = await Todos.find({ uid });
        res.status(200).json({ todos });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})


router.get('/single/:id', verifyToken, async (req, res) => {
    try {
        const { uid } = req;
        const { id } = req.params;
        const todos = await Todos.findOne({ uid, id });
        res.status(200).json({ todos });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.patch('/update', verifyToken, async (req, res) => {

    try {
        const { id, title, dueDate, description, priority, status, isCompleted } = req.body;
        const { uid } = req;

        const todoData = { title, dueDate, description, priority, status, isCompleted };

        const updatedTodo = await Todos.findOneAndUpdate({ uid, id }, todoData, { returnDocument: 'after' });

        res.status(201).json({ message: 'Todo updated successfully', todo: updatedTodo });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

})

router.delete('/single/:id', verifyToken, async (req, res) => {
    try {
        const { uid } = req;
        const { id } = req.params;
        const todos = await Todos.findOneAndDelete({ uid, id });
        res.status(200).json({ message: 'Todo deleted successfully', todos });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;