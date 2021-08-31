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

const getOneRequestedPlace = async (req, res) => {
    try {
        const data = await Place.findOne({_id: req.params.id});
        return res.json({message: "Success to retrive places", data})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const acceptRequest = async (req, res) => {
    try {
        const {_id, ...data} = req.body;
        const place = await Place.updateOne({_id}, data);
        return res.json({
            message: "Success to update place",
            data: {id: place._id}
        });
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const rejectRequest = async (req, res) => {
    try {
        const {_id, ...data} = req.body;
        const place = await Place.updateOne({_id}, data);
        // hapus ownership sementara
        const owner = await Owner.find({placesId: {_id}})
        await owner.delete();
        return res.json({
            message: "Success to update place",
            data: {id: place._id}
        });
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

// const getOwnerPlaceStatus = async (req, res) => {
//     try {
//         const id = req.params.id;
//         let data = await Owner.find({placesId: id})
//         return res.json({
//             message: "Sukses", data
//         })
//     } catch (error) {
//         console.log(error);
//         if (error.code)
//             return res.status(error.code).json(error.message);
//         return res.status(500).json({message: serverErrMsg});
//     }
// }

// const deletePlace = async (req, res) => {
//     try {
//         const place = await Place.findOne({_id: req.params.id});
//         await place.delete();
//         return res.json({message: "Success to delete places"})
//     } catch (error) {
//         console.log(error);
//         if (error.code)
//             return res.status(error.code).json(error.message);
//         return res.status(500).json({message: serverErrMsg});
//     }
// }

// const updatePlace = async (req, res) => {
//     try {
//         const {_id, ...data} = req.body;
//         const place = await Place.updateOne({_id}, data);
//         return res.json({
//             message: "Success to update place",
//             data: {id: place._id}
//         });
//     } catch (error) {
//         console.log(error);
//         if (error.code)
//             return res.status(error.code).json(error.message);
//         return res.status(500).json({message: serverErrMsg});
//     }
// }

module.exports = {
    getRequestedPlaces,
    getOneRequestedPlace,
    acceptRequest,
    rejectRequest
}
