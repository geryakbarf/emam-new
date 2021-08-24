const { Cuisine } = require('../../data/mongo/master');

const getAll = async(req,res) => {
    const cuisines = await Cuisine.find();
    res.json(cuisines);
}

module.exports = {
    getAll
}