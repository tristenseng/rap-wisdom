const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient





const uri = "mongodb+srv://tristenseng:D%40ll%40s214%21@cluster-rw.z3qedjw.mongodb.net/?retryWrites=true&w=majority";

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
                     
            app.listen(3000, () => {
                console.log('listening!')
            })


        }
    )
    .catch(console.error)