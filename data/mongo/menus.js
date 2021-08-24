const mongo = require('./index');
const mongoose_delete = require('mongoose-delete');
const {Schema} = mongo;

const modelName = 'Menu';

const coffeeInfoSchema = new Schema({
    label: String,
    infos: [String]
});

const variantSchema = new Schema({
    id: String,
    name: String,
    prices: Number
})

const schema = new Schema({
    name: String,
    description: String,
    placeId: String,
    category: String,
    prices: {
        normal_price: Number,
        sale_price: Number,
        sale_price_until: Date
    },
    ingredients: [String],
    coffee_infos: [coffeeInfoSchema],
    photo: {
        path: String,
        options: Schema.Types.Mixed
    },
    is_draft: Boolean,
    variant: [variantSchema]
}, {timestamps: {}});

schema.index({name: 'text'})

schema.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true})

const Model = mongo.model(modelName, schema);

module.exports = Model;
