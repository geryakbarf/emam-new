const Place = require('../../data/mongo/places');
const Owner = require('../../data/mongo/places_owner');

const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin.";

const getAllOwners = async (req, res) => {
    try {
        let data = await Owner.find();
        data = data.map(e => {
            let doc = e._doc
            doc.updatedAt = moment(doc.updatedAt).format("YYYY-MM-DD HH:mm")
            return doc;
        });
        for (let i = 0; i < data.length; i++) {
            let date = new Date(Date.parse(data[i].updatedAt) + 12096e5)
            data[i].nextUpdate = moment(date).format("YYYY-MM-DD HH:mm")
            let place = await Place.find({_id: {$in: data[i].placesId}});
            if (place.length > 0)
                data[i].placeName = place[0].name;
        }
        return res.json({message: "Success to retrive places", data})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const addOwner = async (req, res) => {
    try {
        const owner = await Owner.create(req.body);
        const data = await Owner.findOne({name: owner.name});
        return res.json({
            message: "Sukses menambahkan owner",
            data: {id: data._id}
        });
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getOneOwner = async (req, res) => {
    try {
        let data = await Owner.findOne({_id: req.params.id});
        data = data._doc;
        data.oriaddonsDate = data.addonsDate;
        data.orisubsDate = data.subsDate;
        if (data.addonsDate) {
            let date = new Date(Date.parse(data.addonsDate) + 6.048e+8);
            data.addonsEndDate = moment(date).format("DD-MM-YYYY");
            date = new Date(Date.parse(data.addonsDate));
            data.addonsDate = moment(date).format("DD-MM-YYYY");
        } else {
            data.addonsDate = "No Yet Addons";
            data.addonsEndDate = "No Yet Addons";
        }
        if (data.subsDate) {
            let date = new Date(Date.parse(data.subsDate));
            date.setMonth(date.getMonth() + 1);
            data.subsEndDate = moment(date).format("DD-MM-YYYY");
            date = new Date(Date.parse(data.subsDate));
            data.subsDate = moment(date).format("DD-MM-YYYY");
        } else {
            data.subsDate = "No Yet Subscriptions";
            data.subsEndDate = "No Yet Subscriptions";
        }
        //Method kampret
        let places = await Place.find({_id: {$in: data.placesId}});
        let endDate = new Date(Date.parse(data.subsDate));
        endDate.setMonth(endDate.getMonth() + 1);
        if (endDate.getTime() >= new Date().getTime()) {
            for (let i = 0; i < places.length; i++) {
                const update = await Place.updateOne({slug: places[i].slug}, {$set: {views: 0}});
            }
        }
        return res.json({message: "Success to retrive places", data})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const updateOwner = async (req, res) => {
    try {
        const {_id, ...data} = req.body;
        const owner = await Owner.updateOne({_id}, data);
        return res.json({
            message: "Success to update place",
            data: {id: owner._id}
        });
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const insertPlacetoList = async (req, res) => {
    try {
        const value = req.body;
        //Validasi Jika tempat sudah ada di wishlist
        if (value.placeID) {
            const check = await Owner.findOne({_id: value.ownerId, "placesId": value.placeID});
            if (check != null)
                return res.json({err_code: "004", message: "Tempat sudah ada dalam list anda"});
        }
        await Owner.updateOne({_id: value.ownerId}, {
            $push: {
                "placesId": value.placeID
            }
        });
        return res.json({
            message: "Sukses menambahkan tempat ke list",
            data: value.ownerId
        });
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const deleteOwner = async (req, res) => {
    try {
        const owner = await Owner.findOne({_id: req.params.id});
        await owner.delete();
        return res.json({message: "Success to delete owner"})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getOwnerPlaceStatus = async (req, res) => {
    try {
        const id = req.params.id;
        let data = await Owner.find({placesId: id})
        return res.json({
            message: "Sukses", data
        })
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

module.exports = {
    getAllOwners,
    addOwner,
    getOneOwner,
    updateOwner,
    insertPlacetoList,
    deleteOwner,
    getOwnerPlaceStatus
}