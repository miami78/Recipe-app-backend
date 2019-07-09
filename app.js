//MONGODB PW: Pass2word!
//MONGODB CONNECTION: mongodb+srv://Miami:<password>@cluster0-ffy2b.mongodb.net/test?retryWrites=true&w=majority
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Recipes = require('./models/recipes');

const app = express();

mongoose.connect('mongodb+srv://Miami:Pass2word!@cluster0-ffy2b.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//POST  /api/recipes  — adds a new recipe to the database
app.post('/api/recipes', (req, res, next) => {
    const recipes = new Recipes({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty,
    });
    recipes.save().then(
        () => {
            res.status(201).json({
                message: 'Recipe saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

//GET  /api/recipes/:id  — returns the recipe with the provided ID from the database
app.get('/api/recipes/:id', (req, res, next) => {
    Recipes.findOne({
        _id: req.params.id
    }).then(
        (recipes) => {
            res.status(200).json(recipes);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});

//PUT  /api/recipes/:id  — modifies the recipe with the provided ID
app.put('/api/recipes/:id', (req, res, next) => {
    const recipes = new Recipes({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty,
    });
    Recipes.updateOne({ _id: req.params.id }, recipes).then(
        () => {
            res.status(201).json({
                message: 'Recipe updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

//DELETE  /api/recipes/:id  — deletes the recipe with the provided ID
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipes.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

//GET  /api/recipes  — returns all recipes in database
app.use('/api/recipes', (req, res, next) => {
    Recipes.find().then(
        (recipes) => {
            res.status(200).json(recipes);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

module.exports = app;
