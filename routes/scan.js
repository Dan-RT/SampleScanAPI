var express = require('express');
var router = express.Router();

const IngredientModel = require('../public/javascripts/mongoose/IngredientSchema');
var ingredient = require('../public/javascripts/model/ingredient');

var listIngredients = [];
listIngredients.push(new ingredient("Tomato Sauce", "plat", "lunch", "100", 1, ["tomato", "sauce", "bolognaise", "provençale"], "100000"));
listIngredients.push(new ingredient("Pesto Sauce", "plat", "lunch", "100", 1, ["sauce", "pesto"], "100001"));
listIngredients.push(new ingredient("Pasta", "plat", "lunch", "100", 1, ["pasta", "pates", "pâtes", "spaghetti", "torti"], "100002"));

//ALL GOOD, TESTED AND APPROVED

router.get('/test', function(req, res, next) {
    res.send('yup');
});


//GET ingredients par keyword
router.get('/search/keywords/:keywords', function(req, res) {
    console.log("\nGET request: ");

    IngredientModel.find({
        keywords: req.params.keywords
    }).then(doc => {
        res.send(doc);
    }).catch(err => {
        console.error(err);
    });
});

//GET ingredients par barCode
router.get('/search/barCode/:barCode', function(req, res) {
    console.log("\nGET request: ");
    var code = String(req.params.barCode);

    IngredientModel.find({
        barCode: code
    }).then(doc => {
        res.send(doc);
    }).catch(err => {
        console.error(err);
    });
});

//ADD changer pour dynamique add
router.post('/add', function(req, res) {

    /*let ingredientToAdd = new IngredientModel({
        barCode: listIngredients[2].barCode,
        name: listIngredients[2].name,
        typeDish: listIngredients[2].typeDish,
        typeMeal: listIngredients[2].typeMeal,
        weight: listIngredients[2].weight,
        quantity: listIngredients[2].quantity,
        keywords: listIngredients[2].keywords
    });*/

    let ingredientToAdd = new IngredientModel({
        barCode: listIngredients[2].barCode,
        name: listIngredients[2].name,
        typeDish: listIngredients[2].typeDish,
        typeMeal: listIngredients[2].typeMeal,
        weight: listIngredients[2].weight,
        quantity: listIngredients[2].quantity,
        keywords: listIngredients[2].keywords
    });

    ingredientToAdd.save()
        .then(doc => {
            console.log("\nINGREDIENT INSERTION SUCCESSED");
            console.log(doc);
            res.send(doc);
        }).catch(err => {
            console.error(err);
            res.send("{error:true}");
        });

});

//DELETE by barCode
router.get('/delete/barCode/:barCode', function(req, res) {

    var code = String(req.params.barCode);

    IngredientModel
        .findOneAndRemove({
            barCode: code
        }).then(response => {
        console.log("\nINGREDIENT DELETED");
        res.send(response);
    }).catch(err => {
        console.error(err);
        res.send("{error:true}");
    });
});

//DELETE by keywords
router.get('/delete/keywords/:keywords', function(req, res) {
    IngredientModel
        .findOneAndRemove({
            keywords: req.params.keywords
        }).then(response => {
        console.log("\nINGREDIENT DELETED");
        res.send(response);
    }).catch(err => {
        console.error(err);
        res.send("{error:true}");
    });
});

//DELETE by id
router.get('/delete/id/:id', function(req, res) {
    console.log("\nGET request: ");

    IngredientModel.findOneAndRemove({
        _id: req.params.id
    }).then(doc => {
        res.send(doc);
    }).catch(err => {
        console.error(err);
    });
});

module.exports = router;
