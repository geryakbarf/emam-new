const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
const Claim = require('../../data/mongo/claimbusiness');
const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin."

const createPlace = async (req, res) => {
    try {
        const place = await Place.create(req.body);
        const data = await Place.findOne({slug: place.slug});
        return res.json({
            message: "Success to create place",
            data: {id: data._id}
        });
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }

}

const insertClaim = async (req, res) => {
    try {
        let data = req.body;
        let operationalTimes = "";
        //Send to Message Area
        for (let i of data.operational_times) {
            operationalTimes = operationalTimes.concat("-%20" + i.day + "%20" + (i.is_open ? "Buka" : "Tutup") + "%2C" + (i.is_open ? "%20Jam%20Buka%20%3A%20" + i.openTime + "%2C%20Jam%20Tutup%20%3A%20" + i.closeTime + "%0A" : "%0A"))
        }
        let text = "Halo%20emam%20Indonesia%20%21%0A%0APerkenalkan%20saya%20" + data.ownerName + "%20sebagai%20pemilik%20dari%20tempat%20makan%20" + data.placeName + "%20saya%20yang%20beralamatkan%20di%20" + data.placeAddress + "%2C%20ingin%20mengklain%20tempat%20makan%20saya%20ini.%20Untuk%20data%20syarat%20klaimnya%2C%20adalah%20%3A%0A%0ANama%20Tempat%20Makan%20%3A%20" + data.placeName + "%0AAlamat%20%3A%20" + data.placeAddress + "%0ANama%20Pemilik%20%3A%20" + data.ownerName + "%0ANomor%20Telepon%20%3A%20" + data.ownerPhoneNumber + "%0AJam%20Operasional%20%3A%20%0A" + operationalTimes + "%0ASaya%20tunggu%20kabar%20selanjutnya%20dari%20emam%20Indonesia.%20Atas%20perhatiannya%2C%20saya%20ucapkan%20terima%20kasih%20%21"
        //Send to Email Area
        let jamOperasional = "";
        for (let i of data.operational_times) {
            jamOperasional = jamOperasional.concat("- " + i.day + " " + (i.is_open ? "Buka" : "Tutup") + "," + (i.is_open ? " Jam Buka : " + i.openTime + ", Jam Tutup : " + i.closeTime + "<br>" : "<br>"))
        }

        return res.json({
            message: "Sukses klaim tempat anda",
            data: {message: text}
        })
    } catch (error) {
        console.log(error)
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const updatePlace = async (req, res) => {
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
const getOwnerPlace = async (req, res) => {
    try {
        const place = req.body;
        let data = await Place.find({_id: {$in: place.placesId}})
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

const getPlaces = async (req, res) => {
    try {
        let data = await Place.find();
        data = data.map(e => {
            let doc = e._doc
            doc.updatedAt = moment(doc.updatedAt).format("YYYY-MM-DD HH:mm")
            return doc;
        })
        return res.json({message: "Success to retrive places", data})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getOnePlace = async (req, res) => {
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

const getMenuCategoriesPlace = async (req, res) => {
    try {
        let data = await Place.findOne({_id: req.params.id});
        data = data.menu_categories ? data.menu_categories : [];
        return res.json({message: "Success to retrive menu categories", data})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const deletePlace = async (req, res) => {
    try {
        const place = await Place.findOne({_id: req.params.id});
        await place.delete();
        return res.json({message: "Success to delete places"})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const saveMenuCategoriesPlace = async (req, res) => {
    try {
        const {categories} = req.body;
        const place = await Place.findOne({_id: req.params.id});
        if (!place) throw {code: 404, message: "Place not found"};
        place.menu_categories = categories;
        await place.save();
        return res.json({message: "Success to save menu categories"})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const _boldStringHtml = (str, strBolded) => {
    const searchMask = strBolded;
    const regEx = new RegExp(searchMask, "ig");
    const replaceMask = `<strong>${strBolded}</strong>`;

    return str.replace(regEx, replaceMask);
}

const _searchMenuPlace = async (keyword) => {
    try {
        const menus = await Menu.find({
            name: {
                $regex: keyword,
                $options: 'i'
            }
        }).limit(5).select('placeId name photo _id');
        const places = await Place.find({
            _id: {$in: menus.map(e => (e.placeId))},
            is_draft: false
        }).select('name slug _id');
        console.log(keyword, menus.map(e => (e.placeId)));
        const results = menus.map(e => {
            let {name, placeId, photo, _id} = e;
            // console.log(name);
            // name = _boldStringHtml(name, keyword);
            let [place] = places.filter(e1 => (e1._id == placeId));
            if (!place) return null;
            // place.name = _boldStringHtml(place.name, keyword);
            return {_id, name, photo, placeName: place.name, slug: place.slug};
        }).filter(e => e != null)
        return Promise.resolve(results);
    } catch (error) {
        return Promise.reject(error);
    }
}

const searchPlacesAndMenus = async (req, res) => {
    try {
        const {keyword} = req.query;
        const placesQuery = Place.find({
            name: {
                $regex: keyword,
                $options: 'i'
            },
            is_draft: false
        }).limit(5).select('name slug address photo');
        const menusQuery = _searchMenuPlace(keyword);
        let [places, menus] = await Promise.all([placesQuery, menusQuery]);
        return res.render('partials/search-bar-place', {places, menus, keyword});
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});

    }
}

const searchPlace = async (req, res) => {
    try {
        const {keyword} = req.query;
        if (keyword == '' || keyword ==' ') return res.json({
            message: "Success to retrive places",
            data: []
        })
        let params = {name: {$regex: keyword, $options: 'i'}, is_draft: false};
        const placesQuery = await Place.find(params).limit(5).select('_id name slug address photo');
        return res.json({
            message: "Success to retrive places",
            data: placesQuery
        })
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

module.exports = {
    getPlaces,
    getOnePlace,
    createPlace,
    updatePlace,
    deletePlace,
    getMenuCategoriesPlace,
    saveMenuCategoriesPlace,
    searchPlacesAndMenus,
    insertClaim,
    getOwnerPlace,
    searchPlace
}
