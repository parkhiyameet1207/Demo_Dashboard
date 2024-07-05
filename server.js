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
  const { listId, title } = req.body
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

// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/kanban", { useNewUrlParser: true, useUnifiedTopology: true });

// const listSchema = new mongoose.Schema({
//   title: String,
//   position: Number,
//   cards: [
//     {
//       title: String,
//       position: Number
//     }
//   ]
// });

// const Board = mongoose.model("Board", listSchema);

// // API endpoints
// app.get("/board", async (req, res) => {
//   const board = await Board.find({});
//   res.json(board);
// });

// app.post("/move-list", async (req, res) => {
//   const { oldListIndex, newListIndex } = req.body;
  
//   // Logic to update list positions in MongoDB
//   const board = await Board.find({});
//   const listToMove = board.splice(oldListIndex, 1)[0];
//   board.splice(newListIndex, 0, listToMove);
  
//   await Board.deleteMany({});
//   await Board.insertMany(board);
  
//   res.json({ message: "List moved" });
// });

// app.post("/move-card", async (req, res) => {
//   const { sourceListId, destListId, oldCardIndex, newCardIndex } = req.body;
  
//   // Logic to update card positions in MongoDB
//   const sourceList = await Board.findById(sourceListId);
//   const cardToMove = sourceList.cards.splice(oldCardIndex, 1)[0];
//   const destList = await Board.findById(destListId);
//   destList.cards.splice(newCardIndex, 0, cardToMove);
  
//   await sourceList.save();
//   await destList.save();
  
//   res.json({ message: "Card moved" });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
