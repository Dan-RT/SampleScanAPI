class recipe {

    constructor (name, ingredientsBarCode, keywords, description) {
        this.name = name;
        this.ingredientsBarCode = ingredientsBarCode;
        this.keywords = keywords;
        this.description = description;
    }

    _generateKeywords() {
        let currentObject = this;

        this.ingredients.forEach(function(item) {
            item.keywords.forEach(function (keyword) {
                currentObject.keywords.push(keyword);
            })
        });

    }

    addIngredients(ingredientsBarCode) {
        this.ingredients.push(ingredientsBarCode);
        //Do Stuffs with keywords
    }

    matchKeyword(word) {
        return this.keywords.includes(word);
    }

    toJSON () {
        return {
            'name': this.name,
            'ingredientsBarCode': this.ingredientsBarCode,
            'keywords': this.keywords,
            'description': this.description
        };
    }
}

module.exports = recipe;
