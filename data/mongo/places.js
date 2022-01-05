const mongo = require('./index');
const mongoose_delete = require('mongoose-delete');
const {baseTypeValSchema} = require('./extra');
const {Schema} = mongo;
const modelName = 'Place';

const facilitySchema = new Schema({
    name: String,
    options: Schema.Types.Mixed
});
const callToActionSchema = new Schema(baseTypeValSchema);

const gallerySchema = new Schema({
    category: String,
    path: String,
    options: Schema.Types.Mixed
});

const paymentDetailSchema = new Schema({
    id: String,
    type: String,
    name: String,
    condition: String
})

const operationalTimeSchema = new Schema({
    day: String,
    openTime: String,
    closeTime: String,
    is_open: Boolean,
    is_24Hours: Boolean,
    options: Schema.Types.Mixed
});

const schema = new Schema({
    name: String,
    slug: {type: String, unique: true},
    description: String,
    bio: String,
    city: String,
    address: String,
    cuisines: [String],
    parkir: Schema.Types.Mixed,
    categories: Schema.Types.Mixed,
    is_partner: Boolean,
    is_draft: Boolean,
    is_halal: Boolean,
    is_sticker: Boolean,
    contactType: String,
    contactNumber: Number,
    payments: Schema.Types.Mixed,
    photo: {
        path: String,
        options: Schema.Types.Mixed
    },
    menu_categories: [String],
    operationalTimesStatus: Boolean,
    operational_times: [operationalTimeSchema],
    facilities: [facilitySchema],
    call_to_actions: [callToActionSchema],
    galleries: [gallerySchema],
    covid: [String],
    payment_detail: [paymentDetailSchema],
    views: Number,
    is_requested : Boolean,
    is_rejected : String,
    to_ceo : Boolean,
    is_visited : Boolean
}, {timestamps: {}});

schema.index({name: 'text', address: 'text', city: 'text'})

schema.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true})

const Model = mongo.model(modelName, schema);

module.exports = Model;
