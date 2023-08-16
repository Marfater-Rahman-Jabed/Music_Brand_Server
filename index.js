const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// 
// 

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.4jznvny.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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

        const VideosCollection = client.db('MusicBrand').collection('VideosCollection')
        const BlogCollection = client.db('MusicBrand').collection('BlogCollection')

        app.get('/videos', async (req, res) => {
            const query = {};
            const cursor = VideosCollection.find(query).sort({ _id: -1 });
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/allblogs', async (req, res) => {
            const query = {};
            const cursor = BlogCollection.find(query).sort({ _id: -1 });
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/popularblogs', async (req, res) => {
            const query = {};
            const cursor = BlogCollection.find(query).sort({ view: -1 });
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/blogdetailsshow/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            };
            const cursor = BlogCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })



        app.post('/uploadVideo', async (req, res) => {
            const query = req.body;
            const result = await VideosCollection.insertOne(query)
            res.send(result)
        })
        app.post('/createPost', async (req, res) => {
            const query = req.body;
            const result = await BlogCollection.insertOne(query)
            res.send(result)
        })





        app.put('/updateTitle', async (req, res) => {
            const query = req.body;
            const filter = {
                _id: new ObjectId(query.id)
            }
            const updatedDoc = {
                $set: {
                    title: query.title
                }
            }
            const result = await VideosCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        app.put('/updateImage', async (req, res) => {
            const query = req.body;
            const filter = {
                _id: new ObjectId(query.id)
            }
            const updatedDoc = {
                $set: {
                    picture: query.img
                }
            }
            const result = await VideosCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })
        app.put('/ViewUpdate', async (req, res) => {
            // const id = req.params.id
            const query = req.body;
            const filter = {
                _id: new ObjectId(query.id)
            }
            const updatedDoc = {
                $set: {
                    view: query.view
                }
            }
            const result = await BlogCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })




        app.delete('/videoDelete/:id', async (req, res) => {
            const id = req.params.id
            const filter = {
                _id: new ObjectId(id)
            }
            const result = await VideosCollection.deleteOne(filter)
            res.send(result)
        })


    } finally {

    }
}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('Music Brand Server is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})