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

function asyncLoopKeywordsRecipes(res, i, ingredientArray, keywordsIngredients, callback) {
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

                asyncLoopKeywordsRecipes(res, i+1, ingredientArray, keywordsIngredients, callback);
            } else {
                asyncLoopKeywordsRecipes(res, i+1, ingredientArray, keywordsIngredients, callback);
            }
        }).catch(err => {
            console.error(err);
            res.send("error:\"true\"");
        });

    } else {
        callback(keywordsIngredients);
    }
}

function asyncLoop(res, i, ingredientBarCodes, ingredientArray, callback) {
    console.log("ingredients:");
    console.log(ingredientBarCodes);
    console.log("fin ingrédients");

    try {
        if(i < ingredientBarCodes.length) {
            console.log(i);
            console.log(ingredientBarCodes[i]);

            IngredientModel.find({
                barCode: String(ingredientBarCodes[i])
            }).then(doc => {
                console.log(doc);
                if (doc.length > 0) {
                    console.log("\nINGREDIENT FOUND");
                    ingredientArray.push(doc[0].toObject());
                } else {
                    console.log("\nINGREDIENT NOT FOUND");
                }
                asyncLoop(res, i+1, ingredientBarCodes, ingredientArray, callback);
            }).catch(err => {
                console.error(err);
                asyncLoop(res, i+1, ingredientBarCodes, ingredientArray, callback);
            });

        } else {
            callback(ingredientArray);
        }
    } catch (e) {
        console.log(e);
        callback(null);
    }
}

function asyncLoopRecipes(res, i, recipesArray, callback) {

    try {
        if(i < recipesArray.length) {
            var recipetmp = recipesArray[i];
            console.log(recipetmp);
            var ingredientArray =[];
            asyncLoop(res, 0, recipetmp.ingredientsBarCode, ingredientArray, function () {
                recipetmp.ingredientsDetailed = ingredientArray;
                asyncLoopRecipes(res, i+1, recipesArray, callback);
            });
        } else {
            callback(recipesArray);
        }
    } catch (e) {
        console.log(e);
        callback(null);
    }
}

function loopRecipes (res, doc) {
    for (let i = 0; i < doc.length; i++) {
        var ingredientArray = [];
        asyncLoop(res, i, doc[i].ingredientsBarCode, ingredientArray, function (ingredientArray) {
            console.log("ingredientsDetailed");
            doc[i].ingredientsDetailed = ingredientArray;
            console.log(doc[i].ingredientsDetailed);
        });
        console.log("loop: " + i);
    }

    console.log("fin loop");
    res.send(doc);
}

//GET by keywords
router.get('/search/keywords/:keywords', function (req, res) {

    var keywords = req.params.keywords;

    RecipeModel.find({
        keywords: keywords
    }).then(doc => {
        console.log("\nRECIPES FOUND");
        console.log(doc);

        if (doc.length > 0) {
            asyncLoopRecipes(res, 0, doc, function (doc) {
                res.send(doc);
            })
        } else {
            res.send(doc)
        }

    }).catch(err => {
        console.error(err);
        res.send("{error:\"RECIPE NOT FOUND\"}");
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
    var barCodes = ["111114", "111113", "111112", "111111"]; //req.body.ingredientsBarCode;

    asyncLoopKeywordsRecipes(res, 0, barCodes, keywordsIngredients, function(keywordsIngredients) {
        console.log("\nKeywords of the new Recipe:");
        console.log(keywordsIngredients);

        let recipeToAdd = new RecipeModel({
            name: req.body.name,
            ingredientsBarCode: barCodes,
            keywords: keywordsIngredients,
            description: req.body.description
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