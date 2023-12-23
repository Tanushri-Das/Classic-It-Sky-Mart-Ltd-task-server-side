const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion ,ObjectId} = require("mongodb");

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdjlbxg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("ClassicItProducts").collection("users");
    const productsCollection = client.db("ClassicItProducts").collection("products");
    const ordersCollection = client.db("ClassicItProducts").collection("orders");
    

    app.post("/users", async (req, res) => {
        const user = req.body;
        console.log(user);
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        console.log("existingUser", existingUser);
        if (existingUser) {
          return res.send({ message: "user already exists" });
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });

      app.get("/products",async (req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result);
      });

      app.get("/product/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const product = await productsCollection.findOne(query);
        res.send(product);
      });

      app.post("/orders", async (req, res) => {
        const newItem = req.body;
        const result = await ordersCollection.insertOne(newItem);
        res.send(result);
      });

  } finally {

  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Classic It Task server side is running");
});
app.listen(port, () => {
  console.log(`Classic It Task server side running on port ${port}`);
});
