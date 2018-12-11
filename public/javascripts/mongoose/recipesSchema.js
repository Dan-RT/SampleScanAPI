let mongoose = require('mongoose');

let recipeSchema  = new mongoose.Schema({
    name: String,
    ingredientsBarCode: Array,
    keywords: Array,
    ingredientsDetailed: Array,
    description: String
});

module.exports = mongoose.model('Recipe', recipeSchema);