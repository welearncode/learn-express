let express = require('express');

let app = express();

app.get('/', (req, res) => res.send('Hello World!'));


// this is a database package
let Datastore = require('nedb')
let db = {};
// we'll make two tiny databases
db.users = new Datastore();
db.products = new Datastore();

// these databases don't write to a file
// this means that when you restart the server
// all previous data is lost

let productCounter = 0;


// The colon tells express to take the value 
// and save it to req.params
// the name after the colon tells express
// what to call it
app.get('/product/:name/cost/:cost', (req, res) => {

    // lets get two values from the url
    let productName = req.params.name;
    let productCost = req.params.cost;
    productCounter = productCounter + 1;

    // this is how we insert things into the database
    db.products.insert({name: productName, id: productCounter, cost: productCost});

    // lets send a response back to the browser
    // to let it know the data was saved
    res.send({status: 'success', id: productCounter});
});

// we have one param, name
app.get('/product/:name', (req, res) => {
    let productName = req.params.name;

    // this is how you'd look up something by name
    // this is called a query
    // queries look like {attribute: value that I want to match}
    // we could also query by id 
    // Example queries
    // {id: 1}, {id: 2}, {cost: 100}, {cost: {$gt: 100}}
    // the last example is cost greater than 100
    db.products.findOne({name: productName}, (err, result) => {
        // this is a function that gets called when find is done
        res.send(result);
    });
});

app.listen(3000, () => console.log('Our webserver is listening on port 3000'));

