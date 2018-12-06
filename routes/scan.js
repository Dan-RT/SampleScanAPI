var express = require('express');
var router = express.Router();

const IngredientModel = require('../public/javascripts/mongoose/IngredientSchema');

var listIngredients = [];
listIngredients.push(new Ingredient("Tomato Sauce", "plat", "lunch", "100", 1, ["tomato", "sauce", "bolognaise", "provençale"]));
listIngredients.push(new Ingredient("Pesto Sauce", "plat", "lunch", "100", 1, ["sauce", "pesto"]));
listIngredients.push(new Ingredient("Pasta", "plat", "lunch", "100", 1, ["pasta", "pates", "pâtes", "spaghetti", "torti"]));


/* GET users listing. */
router.get('/test', function(req, res, next) {
    res.send('yup');
});

router.get('/get/scanNumber/:scanNumber', function(req, res) {

    console.log("\nGET request: ");

    IngredientModel.find({
        scanNumber: scanNumber
    }).then(doc => {
        res.send(doc);
    }).catch(err => {
        console.error(err);
    });
});

router.post('/add', function(req, res) {

    let ingredientToAdd = new IngredientModel({
        scanNumber: "123456789",
        name: listIngredients[0].name,
        typeDish: listIngredients[0].typeDish,
        typeMeal: listIngredients[0].typeMeal,
        weight: listIngredients[0].weight,
        quantity: listIngredients[0].quantity,
        keywords: listIngredients[0].keywords
    });

    ingredientToAdd.save()
        .then(doc => {
            console.log("\nINGREDIENT INSERTION SUCCESSED");
            console.log(doc);

            var id = doc.toObject()._id;
            insertFridgeList(res, token, id);
        }).catch(err => {
        console.error(err);
        res.send("{error:true}");
    });

});

router.get('/delete/scanNumber/:scanNumber', function(req, res) {

    IngredientModel
        .findOneAndRemove({
            scanNumber: req.params.scanNumber
        }).then(response => {
        console.log("\nINGREDIENT DELETED");
        res.send(response);
    }).catch(err => {
        console.error(err);
        res.send("{error:true}");
    });

});



module.exports = router;
