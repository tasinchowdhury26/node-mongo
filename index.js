const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors()); //To use middleware, we use use();
app.use(bodyParser.json());

// const dbUser = process.env.DB_USER;
// const pass = process.env.DB_PASS; we've integrated dbUser and pass within DB_PATH
//This way it's safer, even no one will understand whether it's in mongo or firebase or somewhere else!
const uri = process.env.DB_PATH;    // user and password included in .env 
// the .env has been ignored using .gitignore  

let client = new MongoClient(uri, { useNewUrlParser: true });
const users = ['Jen', 'Laura', 'Mitch', 'Bryce', 'Eddy', 'Green'];


// const rootCall = (req,res) => res.send('Thank you so much');     //We will use callback that's why omitted this.
//Remember the HTTP requests GET,POST methods ???
// Here's get
app.get('/products', (req,res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products"); //we named the db 'onlineStore' which is collection of products
        // perform actions on the collection object
        //we use find() to read data from db, converting into an array using toArray()
        //we're not passing anything for which we're just calling a callback in toArray()
        //here, documents is the data we're reading from db
        collection.find({name:'mobile'}).limit(5).toArray( (err, documents) => {
            if(err)
            {
                console.log(err);
                res.status(500).send({message:err});
            }
            else
            {
                res.send(documents);
            }
        })
        client.close();
      });
});
app.get(('/users/:id'), (req,res) => {
    const id = req.params.id;
    const name = users[id];
    res.send({id, name});
})

//Here's post
app.post('/addProduct', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    //Database connection
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result) => {
            if(err)
            {
                console.log(err);
                res.status(500).send({message:err});
            }
            else
            {
                res.send(result.ops[0]);
            }
        })
        client.close();
    })
})
const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listening to port 4200'));