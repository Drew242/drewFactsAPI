var configFile = require('./config');
var Fact = require('./models/fact'); // model needed for Fact API

var mongoose = require('mongoose');
mongoose.connect(configFile.mongoDbConnection); // connect to MongoDB

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    console.log('Route tagged');
    next(); // make sure we go to the next routes and don't hang here
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'Welcome to Drew Facts! This is the first API on the internet!' });
});

// on routes that end in /facts
router.route('/facts')

    // create a new fact
    .post(function (req, res) {
        console.log('In the POST')

        var fact = new Fact();
        fact.description = req.body.description;

        console.log(fact, fact.description, req.body.description);
        // save the fact and check for errors
        fact.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Fact created!' });
        })
    })

    // get all the facts (accessed at GET http://localhost:8080/api/facts)
    .get(function (req, res) {
        console.log('In the GET')
        Fact.find(function (err, facts) {
            if (err)
                res.send(err);
            console.log(res.json(facts));
            res.json(facts);
        });
    });

router.route('/facts/:fact_id')

    // get the fact with that id (accessed at GET http://localhost:8080/api/facts/:fact_id)
    .get(function (req, res) {
        console.log('GETting Fact by ID')
        Fact.findById(req.params.fact_id, function (err, fact) {
            if (err)
                res.send(err);
            res.json(fact);
        })
    })

    .put(function (req, res) {
        // use our fact model to find the fact we want
        Fact.findById(req.params.fact_id, function (err, fact) {
            console.log('PUT the update on the fact')
            if (err)
                res.send(err);

            fact.description = req.body.description;  // update the facts info

            // save the fact
            fact.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Fact updated!' });
            });

        })
    })

    // delete the fact with this id (accessed at DELETE http://localhost:8080/api/facts/:fact_id)
    .delete(function (req, res) {
        console.log('DELETEing a fact')
        Fact.remove({
            _id: req.params.fact_id
        }, function (err, fact) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);