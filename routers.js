// routes/userRoutes.js
const mongoose = require("mongoose");

const express = require('express');
const router = express.Router();

const Task = new mongoose.Schema({
    title: String
});


// POST route for adding a user



module.exports = router;
