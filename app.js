const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

app.use(cors());
app.use(express.json({ extended: false }));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server started on port: ", port);
});

// username: dbuser1
// pass: zSTx5E7lwH9ZoA7m

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@pcpartswarehousemanagem.0ibqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("DB connected.");

    const inventoryItemsCollection = client
      .db("InventoryDB")
      .collection("Items");

    app.post("/add-item", async (req, res) => {
      const { imageUrl, itemName, supplierName, itemPrice, description } =
        req.body;
      let item = {
        imageUrl: imageUrl,
        itemName: itemName,
        supplierName: supplierName,
        itemPrice: itemPrice,
        description: description,
        quantity: 0,
      };
      console.log(req.body);
      // inventoryItemsCollection.findOne(req.body.itemName);
      const id = (await inventoryItemsCollection.insertOne(item)).insertedId;
      res.send({ response: `Item Inserted with ID: ${id} ` });
    });

    app.get("/getItems", async (req, res) => {
      const query = {};
      const cursor = inventoryItemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.get("/getItems/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id>>>: ", id);
      const query = { _id: ObjectId(id) };
      const item = await inventoryItemsCollection.findOne(query);
      res.send(item);
    });
  } catch (e) {
    console.log("error is: ", e);
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello User Welcome to Warehouse Management Site Server");
});
