const express = require('express');
var cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydbuser0:7KzVTAX8ytkzW0nR@cluster0.rqp1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("user");

      //GET API
      app.get('/users', async(req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
      })

      // POST API
      app.post('/users', async(req, res) => {
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser);
        //   console.log('a document was inserted', result);
        //   console.log('Hitting the post', req.body);
          res.send(JSON.stringify(result));
      })

      //DELETE API 
      app.delete('/users/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const result = await usersCollection.deleteOne(query);
          console.log('deleting an user with id', result);
          res.json(result);
      })

      //FIND API
      app.get('/users/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await usersCollection.findOne(query);
          console.log('hitting with id', id);
          res.send(result);
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res)=> {
    res.send('Running to CRUD server');
});

app.listen(port, ()=> {
    console.log('Listening to port', port);
})