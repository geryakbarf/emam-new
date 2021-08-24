const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose