const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middelware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfacken.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const userCollection = client.db('paintingDB').collection('user')

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log('New USer: ', user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        app.patch('/user', async (req, res) => {
            const user = req.body
            const filter = { email: user.email };
            const updatedDoc = {
                $set: {
                    lastLoginAt: user.lastLoginAt
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        // CRUD
        const paintingCollection = client.db('paintingDB').collection('painting')

        app.get('/painting', async (req, res) => {
            const cursor = paintingCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/painting/:id', async (req, res) => {
            const id = req.params.id;
            const queary = { _id: new ObjectId(id) };
            const result = await paintingCollection.findOne(queary);
            res.send(result);
        })
        app.post('/painting', async (req, res) => {
            const newCard = req.body;
            console.log('newCard: ', newCard);
            const result = await paintingCollection.insertOne(newCard);
            res.send(result);
        })

        app.put('/painting/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedCard = req.body;

            const product = {
                $set: {
                    item_name: updatedCard.item_name,
                    subcategory_name: updatedCard.subcategory_name,
                    short_description: updatedCard.short_description,
                    price: updatedCard.price,
                    rating: updatedCard.rating,
                    customization: updatedCard.customization,
                    processing_time: updatedCard.processing_time,
                    stock_status: updatedCard.stock_status,
                    email: updatedCard.email,
                    photo: updatedCard.photo
                }
            }
            const result = await paintingCollection.updateOne(filter, product, option);
            res.send(result);
        })

        app.delete('/painting/:id', async (req, res) => {
            const id = req.params.id;
            const queary = { _id: new ObjectId(id) };
            const result = await paintingCollection.deleteOne(queary);
            res.send(result);
        })

        app.get("/myProduct/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await paintingCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Painting and Drawing server is running");
})

app.listen(port, () => {
    console.log(`Painting and Drawing server is running on port: ${port
        }`)
})