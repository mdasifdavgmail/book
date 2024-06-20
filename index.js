const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};    
const port = 9100;
const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors(corsOptions));

mongoose.connect("mongodb://localhost:27017/book")
    .then(() => console.log("Mongo connected"))
    .catch(err => console.log("Failed to connect", err));

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genere: {
        type: String,
        required: true,
    },
    publishedyear: {
        type: Number,
    },
});

const Book = mongoose.model("Book", BookSchema);

app.get('/user', async (req, res) => { 
    try {
        const allDbUsers = await Book.find({});
        res.json(allDbUsers);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.route('/user/:id') 
    .get(async (req, res) => {
        try {
            const user = await Book.findById(req.params.id);
            if (!user) return res.status(404).json({ error: "User not found" });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    })
    .put(async (req, res) => {
        const updateData = {
            title: req.body.title,
            author: req.body.author,
            genere: req.body.genere,
            publishedyear: req.body.publishedyear,
        };

        try {
            const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!book) return res.status(404).json({ error: "Book not found" });
            res.json({ status: "success", book });
        } catch (err) {
            console.error("Error updating book:", err);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Book.findByIdAndDelete(req.params.id);
            res.json({ status: "success" });
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

app.post("/user", async (req, res) => {
    const body = req.body;
    if (!body || !body.title_name || !body.author_name || !body.genere || !body.published_year) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await Book.create({
            title: body.title_name, 
            author: body.author_name,
            genere: body.genere,
            publishedyear: body.published_year
        });
        res.status(201).json({ msg: "success", user: result });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => console.log("server started"));
