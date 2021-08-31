const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
const Owner = require('../../data/mongo/places_owner');
const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin."

const getRequestedPlaces = async (req, res) => {
    try {
        let data = await Place.find({ is_requested: true });
        data = data.map(e => {
            let doc = e._doc
            doc.updatedAt = moment(doc.updatedAt).format("YYYY-MM-DD HH:mm")
            return doc;
        })
        return res.json({message: "Success to retrive requested places", data})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const acceptRequest = async (req, res) => {

}

const rejectRequest = async (req, res) => {
    
}

const deleteRequest = async (req, res) => {
    
}

module.exports = {
    getRequestedPlaces,
    acceptRequest,
    rejectRequest,
    deleteRequest
}
