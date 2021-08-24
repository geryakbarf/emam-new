const { CovidProtocol } = require('../../data/mongo/master');
const getAll = async(req,res) => {
    const protocols = await CovidProtocol.find();
    res.json(protocols);
}
module.exports = {
    getAll
}