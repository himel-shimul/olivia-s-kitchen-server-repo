const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2zjbmhw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('oliviasKitchen').collection('services');
        const reviewCollection = client.db('oliviasKitchen').collection('reviews');

        app.get('/services', async (req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/allServices', async (req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.post('/service', async (req, res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })


        // reviews API

        app.get('/reviews', async(req, res) =>{
            let query = {};
            if(req.query.reviewId){
                query = {
                    reviewId: req.query.reviewId
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/review', async (req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // add reviews
        app.post('/reviews', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // delete reviews
        app.delete('/review/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(err => console.error(err))



app.get('/', (req, res) =>{
    res.send('olivias kitchen server is running');
})

app.listen(port, () =>{
    console.log(`server is running on port: ${port}`);
})