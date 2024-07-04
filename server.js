const express = require("express");
const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectId;

mongoose.connect("mongodb://localhost:27017/TasksList");
const maintask = require('./FeatchData')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

const Task = new mongoose.Schema({
  title: String,
  cardId: String,
  parentId: String,
});


const MainTask = mongoose.model('maintask', Task);
const SubtTask = mongoose.model('subtask', Task);

app.get('/api/board/getlsit', async (req, res) => {
  let db = MainTask;
  let data = await db.find().exec();
  res.json(data);
})

app.get('/api/board/getcard', async (req, res) => {
  let db = SubtTask;
  let data = await db.find().exec();
  res.json(data);
})


app.post('/api/board/add', async (req, res) => {
  const { cardText, cardId, listId } = req.body;
  let data = new SubtTask({ title: cardText, cardId: cardId, listId: listId });
  await data.save();
  res.send(data);
});

app.post('/api/board/addlist', async (req, res) => {
  const { listId, title } = req.body;

  let data = new MainTask({ title: title });
  await data.save();
  res.send(data);
});


app.put('/api/board/lists/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    const updatedList = await SubtTask.findByIdAndUpdate(
      listId,
      { title },
      { new: true }
    );

    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/board/lists/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    await SubtTask.findByIdAndDelete(listId);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(5000);