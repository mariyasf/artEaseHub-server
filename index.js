const { MongoClient, ServerApiVersion } = require('mongodb');
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