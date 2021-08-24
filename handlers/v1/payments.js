const {Payment} = require('../../data/mongo/master');
const {PaymentCat} = require('../../data/mongo/master');

const getAll = async (req, res) => {
    const payments = await Payment.find();
    res.json(payments);
}

const getPaymentCategory = async (req, res) => {
    const payments = await PaymentCat.find().select('name type');
    res.json(payments);
}

module.exports = {
    getAll,
    getPaymentCategory
}
