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


// const Card = mongoose.model('Card');

// // Move card endpoint
// router.put('/api/cards/move', async (req, res) => {
//   const { sourceListId, destListId, oldCardIndex, newCardIndex } = req.body;
//   try {
//     if (sourceListId === destListId) {
//       // Fetch all cards in the source list and sort by current position
//       const cards = await Card.find({ listId: sourceListId }).sort('position').exec();
      
//       // Remove the card from its old position
//       const [movedCard] = cards.splice(oldCardIndex, 1);
      
//       // Insert the card at its new position
//       cards.splice(newCardIndex, 0, movedCard);
      
//       // Update positions in the database
//       const bulkOps = cards.map((card, index) => ({
//         updateOne: {
//           filter: { _id: card._id },
//           update: { position: index }
//         }
//       }));
      
//       await Card.bulkWrite(bulkOps);
//     } else {
//       // Fetch all cards in both source and destination lists and sort by current position
//       const sourceCards = await Card.find({ listId: sourceListId }).sort('position').exec();
//       const destCards = await Card.find({ listId: destListId }).sort('position').exec();
      
//       // Remove the card from its old position in the source list
//       const [movedCard] = sourceCards.splice(oldCardIndex, 1);
      
//       // Update the listId of the moved card
//       movedCard.listId = destListId;
      
//       // Insert the card at its new position in the destination list
//       destCards.splice(newCardIndex, 0, movedCard);
      
//       // Update positions in the database for the source list
//       const sourceBulkOps = sourceCards.map((card, index) => ({
//         updateOne: {
//           filter: { _id: card._id },
//           update: { position: index }
//         }
//       }));
      
//       // Update positions in the database for the destination list
//       const destBulkOps = destCards.map((card, index) => ({
//         updateOne: {
//           filter: { _id: card._id },
//           update: { position: index, listId: card.listId }
//         }
//       }));
      
//       await Card.bulkWrite([...sourceBulkOps, ...destBulkOps]);
//     }

//     res.status(200).send({ success: true });
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to move card' });
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// const List = mongoose.model('List');

// // Move list endpoint
// router.put('/api/lists/move', async (req, res) => {
//   const { oldListIndex, newListIndex } = req.body;
//   try {
//     // Fetch all lists and sort by current position
//     const lists = await List.find().sort('position').exec();
    
//     // Remove the list from its old position
//     const [movedList] = lists.splice(oldListIndex, 1);
    
//     // Insert the list at its new position
//     lists.splice(newListIndex, 0, movedList);
    
//     // Update positions in the database
//     const bulkOps = lists.map((list, index) => ({
//       updateOne: {
//         filter: { _id: list._id },
//         update: { position: index }
//       }
//     }));
    
//     await List.bulkWrite(bulkOps);
    
//     res.status(200).send({ success: true });
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to move list' });
//   }
// });

// module.exports = router;


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const subtTaskSchema = new Schema({
//   title: String,
//   cardId: String,
//   listId: { type: Schema.Types.ObjectId, ref: 'MainTask' } // Reference to MainTask
// });

// const mainTaskSchema = new Schema({
//   title: String,
//   subtasks: [{ type: Schema.Types.ObjectId, ref: 'SubtTask' }] // Array of references to SubtTask
// });

// const SubtTask = mongoose.model('SubtTask', subtTaskSchema);
// const MainTask = mongoose.model('MainTask', mainTaskSchema);



// // Create MainTask and optionally add SubtTask
// app.post('/api/board/addlist', async (req, res) => {
//   const { title, cardText, cardId } = req.body;
  
//   try {
//     // Create MainTask
//     let mainTask = new MainTask({ title: title });
//     await mainTask.save();

//     // If SubtTask details are provided, create SubtTask and add reference to MainTask
//     if (cardText && cardId) {
//       let subTask = new SubtTask({ title: cardText, cardId: cardId, listId: mainTask._id });
//       await subTask.save();

//       // Add SubtTask reference to MainTask
//       mainTask.subtasks.push(subTask._id);
//       await mainTask.save();
//     }

//     res.send(mainTask);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// // Add SubtTask to an existing MainTask
// app.post('/api/board/add', async (req, res) => {
//   const { cardText, cardId, listId } = req.body;

//   try {
//     // Find the MainTask by listId
//     let mainTask = await MainTask.findById(listId);
//     if (!mainTask) {
//       return res.status(404).send({ message: 'MainTask not found' });
//     }

//     // Create SubtTask and add reference to MainTask
//     let subTask = new SubtTask({ title: cardText, cardId: cardId, listId: listId });
//     await subTask.save();

//     // Add SubtTask reference to MainTask
//     mainTask.subtasks.push(subTask._id);
//     await mainTask.save();

//     res.send(subTask);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });
