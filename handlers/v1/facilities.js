const { Facility } = require('../../data/mongo/master');
const getAll = async(req,res) => {
    const facilities = await Facility.find();
    res.json(facilities);
}

module.exports = {
    getAll
}