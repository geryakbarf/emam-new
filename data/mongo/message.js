const mongo = require('./index');
const {Schema} = mongo;
const modelName = 'Message';

const messageSchema = new Schema({
    sender: String,
    receiver: String,
    subject: String,
    message: String,
    is_sender_read: Boolean,
    is_receiver_read: Boolean,
    options: Schema.Types.Mixed
}, {timestamps: {}});

const Model = mongo.model(modelName, messageSchema);

module.exports = Model;
