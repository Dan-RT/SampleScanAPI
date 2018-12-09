const express = require('express');
const router = express.Router();

const IngredientModel = require('../public/javascripts/mongoose/IngredientSchema');
const RecipeModel = require('../public/javascripts/mongoose/recipesSchema');
const recipe = require("../public/javascripts/model/recipe");

var listRecipes = [];

listRecipes.push(new recipe("Pâtes Bolo",
                                ["100001", "100000", "100002"],
                                 ["test", "tomato", "pates"],
                                    "test description"
    )
);
/*
listRecipes.push(new recipe("Pâtes Pesto",
    [
        "5becd04a50aa2512d28bb55f",
        "5becd05cae953512d692e9a9"
    ], ["test", "tomato", "pates"], "test description"
    )
);
listRecipes.push(new recipe("Soupe de tomate",
    [
        "5becd03653760912cc84fcbd"
    ], ["soupe", "soup"],  "test description"
    )
);*/

function asyncLoop(res, i, ingredientArray, keywordsIngredients, callback) {
    if(i < ingredientArray.length) {
        console.log(i);

        IngredientModel.find({
            barCode: String(ingredientArray[i])
        }).then(doc => {
            if (doc[0] !== undefined) {
                console.log("\nINGREDIENT FOUND");
                console.log("\nKeyword current ingredients:");

                var keywordsTmp = doc[0].toObject().keywords;
                console.log(keywordsTmp);

                if (keywordsIngredients.length === 0) {
                    keywordsIngredients = keywordsTmp.slice();
                } else {
                    keywordsIngredients = keywordsIngredients.concat(keywordsTmp);
                }

                console.log("\nKeyword total:");
                console.log(keywordsIngredients);

                asyncLoop(res, i+1, ingredientArray, keywordsIngredients, callback);
            } else {
                res.send("error:\"ingredient not found\"");
            }

        }).catch(err => {
            console.error(err);
            res.send("error:\"true\"");
        });

    } else {
        callback(keywordsIngredients);
    }
}

//ALL GOOD, TESTED AND APPROVED

//GET by keywords
router.get('/search/keywords/:keywords/', function (req, res) {

    var keywords = req.params.keywords;

    RecipeModel.find({
        keywords: keywords
    }).then(doc => {
        console.log("\nRECIPE FOUND");
        console.log(doc);
        console.log("\n");
        res.send(doc);
    }).catch(err => {
        console.error(err);
        res.send("{}");
    });

});

//DELETE by ID
router.get('/delete/id/:id', function(req, res) {
    RecipeModel
        .findOneAndRemove({
            _id: req.params.id
        }).then(response => {
        console.log("\nFridge DELETED");
        console.log("\n");
        res.send(response);
    }).catch(err => {
        console.error(err);
        res.send("{}");
    });
});

//DELETE by keywords
router.get('/delete/keywords/:keywords', function(req, res) {
    RecipeModel
        .findOneAndRemove({
            keywords: req.params.keywords
        }).then(response => {
        console.log("\nFridge DELETED");
        console.log("\n");
        res.send(response);
    }).catch(err => {
        console.error(err);
        res.send("{}");
    });
});

//ADD recipes, à changer, hardcodé pour l'instant, testé
router.post('/add/', function(req, res) {
    // Source : https://stackoverflow.com/questions/21829789/node-mongoose-find-query-in-loop-not-working/21830088

    var result = JSON.stringify(req.body);

    console.log(listRecipes[0]);
    console.log("\nPOST request: ");
    //console.log(result);

    var keywordsIngredients = [];

    asyncLoop(res, 0, listRecipes[0].ingredientsBarCode, keywordsIngredients, function(keywordsIngredients) {
        console.log("\nKeywords of the new Recipe:");
        console.log(keywordsIngredients);

        let recipeToAdd = new RecipeModel({
            name: listRecipes[0].name,
            ingredientsBarCode: listRecipes[0].ingredientsBarCode,
            keywords: keywordsIngredients,
            description: listRecipes[0].description
        });

        recipeToAdd.save()
            .then(doc => {
                console.log("\nINSERTION SUCCESSED");
                console.log(doc);
                console.log("\n");
                res.send(doc);
            }).catch(err => {
            console.error(err);
            res.send("{error:true}");
        });
    });

});

module.exports = router;