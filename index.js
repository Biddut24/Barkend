const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 7000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyelykf.mongodb.net/?appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function bootstrap() {
  try {
    const database = client.db("Simple");

    const usersCollection = database.collection("Users;");

    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    //single user get
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //edit update user
    app.patch("/users/:id", async (req, res) => {
      const userId = req.params.id; // ke update hbe

      const query = { _id: new ObjectId(userId) };
      const user = req.body; // info update hbe seta paici
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          name: user.name,
          email: user.email,
          details: user.details,
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc, option);
      res.send(result);
    });

    //delete user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

bootstrap().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Basic Router!");
});

app.listen(port, () => {
  console.log(`Server with mongodb running on: ${port}`);
});
