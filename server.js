const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient





const uri = "replace with link to server";

MongoClient.connect(uri)
    .then(
        client => {
            console.log('connected')
            const db = client.db()
            const quotesCollection = db.collection('quotes')

            app.set('view engine', 'ejs')

            app.use(bodyParser.urlencoded({ extended: true}))
            app.use(express.static('public'))
            app.use(bodyParser.json())

            app.get('/', (req, res) => {
                quotesCollection.find().toArray()
                    .then(results => {
                        console.log(results)
                        res.render('index.ejs', {quotes:results})
                    })
                    .catch(err => console.log(err))

            })


            app.post('/quotes', (req, res) => {
                quotesCollection
                    .insertOne(req.body)
                    .then(result => {
                        res.redirect('/')
                        console.log(result)
                    })
                    .catch(error => console.error(error))
            })

            app.put('/quotes', (req,res) => {
                console.log(req.body)
                quotesCollection.findOneAndUpdate(
                    {   name: 'Yoda' },
                    {
                        $set: {
                            name: req.body.name,
                            quote: req.body.quote
                        }
                    },
                    {
                        upsert: false
                    }
                )
                .then(result => {
                    res.json('Success')
                })
                .catch(err => console.error(err))
            })

            app.delete('/quotes', (req, res) => {
                quotesCollection
                    .deleteOne({name: req.body.name})
                    .then(result => {
                        console.log(result)
                        if(result.deletedCount == 0) {
                            return res.json('No Vader quote to delete')
                        }
                        res.json('Deleted Vader quote!')

                    })
                    .catch(err => console.error(err))
            })

                     
            app.listen(3000, () => {
                console.log('listening!')
            })


        }
    )
    .catch(console.error)