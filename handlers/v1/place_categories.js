const { PlaceCategory } = require('../../data/mongo/master');
const getAll = async(req,res) => {
    let place_categories = await PlaceCategory.find();
    res.json(place_categories);
}

module.exports = {
    getAll
}