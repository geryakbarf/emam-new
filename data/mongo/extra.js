const mongo = require('./index');
const {Schema} = mongo;
const baseKeyValSchema = {
    name: String,
    value: String,
    options: Schema.Types.Mixed
}

const baseTypeValSchema = {
    type: String,
    value: String,
    draft: Boolean,
    options: Schema.Types.Mixed
}

module.exports = {
    baseKeyValSchema,
    baseTypeValSchema
}
