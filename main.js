
"use strict";
require('dotenv').config();
const bodyParser = require('body-parser');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const express = require('express');
const port = 3000;
const app = express();
const mongo = require('mongodb');
const client = mongo.MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.static('articleList'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.get('/articles/', (req, res) => {
    newsapi.v2.everything({
        q: 'Black-Owned Businesses'
        
    }).then(response => {
        res.setHeader('Content-Type', 'application/json');
        res.send(response.articles);
    });
});
app.get('/articles/saved', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    client.connect((e, r) => {
        if (e) {
            console.error(e);
        } else {
            client.db('assignment').collection("savedArticles").find().toArray((e, r) => {
                if (e) {
                    res.send(e.message);
                } else {
                    res.send(r);
                }
            });
        }
    });
});
app.post('/articles/saved', (req, res) => {
    client.connect((e, r) => {
        if (e) {
            console.error(e);
        } else {
            client.db('assignment').collection("savedArticles").insertOne(req.body, (e, r) => {
                if (e) {
                    res.send(e.message);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(r);
                }
            });
        }
    });
});
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
