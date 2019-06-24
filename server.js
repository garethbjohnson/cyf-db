const dotenv = require('dotenv')
const express = require('express')
const mongodb = require('mongodb')

dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

const uri = process.env.DATABASE_URI


app.get('/api/search', function(request, response) {
    const client = new mongodb.MongoClient(uri)

    client.connect(function() {
        const db = client.db('sample_airbnb')
        const collection = db.collection('listingsAndReviews')
        let search = request.query.title
        let price_from = request.query.from
        let price_to = request.query.to

        /* a simple query object */
        const searchObject = {$and: [{$or: [{name: search}, {summary: search} ]}, {price: {$gte: parseInt(price_from)}}, {price: {$lt: parseInt(price_to)}}] }

        collection.find(searchObject).toArray(function(error, results) {
            response.send(error || results)

            client.close()
        })
    })
})

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html')
})

app.listen(port || 3000, function() {
    console.log(`Running at \`http://localhost:${port}\`...`)
})