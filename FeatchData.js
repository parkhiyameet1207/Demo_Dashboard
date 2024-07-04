const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url)


async function maintaskgetdata(){
    const result = await client.connect();
    databasename = result.db('TasksList');
    const collection = databasename.collection('maintasks');
    let db = await collection;
    let results = await db.find().toArray();
  return results
}

async function subtaskgetdata(){
    const result = await client.connect();
    db = result.db('TasksList');
    return db.collection('subtasks');
}

module.exports = {maintaskgetdata : maintaskgetdata , subtaskgetdata : subtaskgetdata};