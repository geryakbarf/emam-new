const mongo = require('./index');
const mongoose_delete = require('mongoose-delete');
const {Schema} = mongo;
const modelName = 'claimbusiness';

const operationalTimeSchema = new Schema({
    day: String,
    openTime: String,
    closeTime: String,
    is_open: Boolean,
    options: Schema.Types.Mixed
});

const schema = new Schema({
    placeId: String,
    ownerName: String,
    ownerPhoneNumber: String,
    address: String,
    operational_times: [operationalTimeSchema],
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Done"],
        default: "Pending"
    },
}, {timestamps: {}});

schema.index({ownerName: 'text', address: 'text'})

schema.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true})

const Model = mongo.model(modelName, schema);

module.exports = Model;
