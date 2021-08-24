const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
const Owner = require('../../data/mongo/places_owner');
const {PlaceCategory} = require('../../data/mongo/master');
const dtlib = require('../../libs/datetime');
const moment = require('moment');
const nodemailer = require('nodemailer');
const place_service = require('../../services/place_service');
const frontend = require('../../libs/frontend');

const homePage = async (req, res) => {
    res.locals.pageTitle = "Kulineran aman dengan menu digital - emam.id";
    const loadJS = [
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: '/assets/js/home.js'}
    ];
    try {
        let newPlaces = await Place.find({is_draft: false})
            .limit(4)
            .sort({createdAt: -1})
            .select('name slug photo address _id');
        let partner = {
            places: []
        };
        let ownerPlace = await Owner.find().select('placesId');
        for (var i = 0; i < ownerPlace.length; i++) {
            let place = await Place.find({is_draft: false, _id: {$in: ownerPlace[i].placesId}}).limit(1);
            partner.places.push(place);
            if (partner.places.length > 4)
                break;
        }
        newPlaces = await place_service.flagWishListedPlace({places: newPlaces, session: req.session});
        const category = await PlaceCategory.find({}).limit(4).select('name image');
        const allCategory = await PlaceCategory.find({}).select('name image');
        return res.render('index', {loadJS, newPlaces, partner, category, allCategory, path: req.route.path})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

const categoryPage = async (req, res) => {
    try {
        const category = await PlaceCategory.find({}).select('name image');
        res.locals.pageTitle = "Explore kategori tempat makan - emam.id"
        return res.render('all-category', {category})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

const _searchMenus = async (keyword) => {
    try {
        const menus = await Menu.find({
            name: {
                $regex: keyword,
                $options: 'i'
            }
        }).limit(5).select('placeId name photo _id');
        const places = await Place.find({_id: {$in: menus.map(e => (e.placeId))}}).select('name slug _id');
        const results = menus.map(e => {
            let {_id, name, placeId, photo} = e;
            // name = _boldStringHtml(name, keyword);
            let [place] = places.filter(e1 => (e1._id == placeId));
            // place.name = _boldStringHtml(place.name, keyword);
            return {_id, name, photo, placeName: place.name, slug: place.slug};
        })
        return Promise.resolve(results);
    } catch (error) {
        return Promise.reject(error);
    }
}

const allpartner = async (req, res) => {
    try {
        let partner = {
            places: []
        };
        let ownerPlace = await Owner.find().select('placesId');
        for (var i = 0; i < ownerPlace.length; i++) {
            let place = await Place.find({is_draft: false, _id: {$in: ownerPlace[i].placesId}});
            partner.places.push(place);
        }
        res.locals.pageTitle = "Explore partner - emam.id"
        return res.render('partner-all', {partner})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

const allPlace = async (req, res) => {
    try {
        const {search_place, search_menu} = req.query;
        let filter = {is_draft: false};
        let allMenus = [];
        if (search_place) filter = {is_draft: false, name: {$regex: search_place, $options: 'i'}};
        let allPlaces = await Place.find(filter)
            .sort({createdAt: -1})
            .select('name slug photo address _id');
        allPlaces = await place_service.flagWishListedPlace({places: allPlaces, session: req.session});
        if (search_menu) {
            allMenus = await _searchMenus(search_menu);
            allPlaces = [];
        }
        res.locals.pageTitle = "Explore tempat makan - emam.id"
        return res.render('place-all', {allPlaces, allMenus})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

const getPlaceCategory = async (req, res) => {
    try {
        const {category} = req.params
        let placeCategory = await Place.find({is_draft: false, "categories.name": category})
            .sort({createdAt: -1})
            .select('name slug photo address _id');
        placeCategory = await place_service.flagWishListedPlace({places: placeCategory, session: req.session});
        res.locals.pageTitle = "Explore " + category + " - emam.id";
        return res.render('place-category', {placeCategory, category})
    } catch (error) {

    }
}

const claimBusiness = async (req, res) => {
    const loadJS = [
        ...frontend.vueDeps,
        {src: "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"},
        {src: "https://unpkg.com/vue-recaptcha@latest/dist/vue-recaptcha.min.js"},
        {src: "https://unpkg.com/sweetalert/dist/sweetalert.min.js"},
        {src: "/assets/js/claim_form.js"},

    ];
    res.locals.pageTitle = "Klaim tempat makan - emam.id"
    const {slug} = req.params;

    try {
        const place = await Place.findOne({is_draft: false, slug});
        if (!place) throw {code: 404, message: "404 Not Found"};
        return res.render('claim', {loadJS, place})
    } catch (error) {
        console.log(error);
        if (error.code == 404)
            return res.status(error.code).send(error.message)
        return res.send('');
    }
}

const tellUs = async (req, res) => {
    const loadJS = [
        ...frontend.vueDeps,
        {src: "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"},
        {src: "https://unpkg.com/vue-recaptcha@latest/dist/vue-recaptcha.min.js"},
        {src: "https://unpkg.com/sweetalert/dist/sweetalert.min.js"},
        {src: "/assets/js/tell-us-form.js"},
    ];
    const slug = req.params.slug;
    res.locals.pageTitle = "Kasih tahu kami - emam.id";
    return res.render('kasihtau', {slug, loadJS})
}

const sendEmail = async (req, res) => {
    //Mengambil data dari inputan
    const json = req.body;
    const placeID = json.slug;
    const name = json.nama;
    const email = json.email;
    const subject = json.subject;
    const pesan = json.pesan;
    try {
        //Deklarasi Nodemailer
        let transport = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: 'laporemam@gmail.com',
                pass: 'Tanyaemam'
            }
        });

        //Opsi Email
        let mailOptions = {
            from: name + " <" + email + ">",
            to: "tanya@emam.id",
            subject: subject,
            html: "<p><b>Hallo tim emam.id!</b></p><br>" +
                "<p>Saya mau ngasih tahu laporan perihal " + subject + "." +
                "Bahwasannya, " + pesan + ". Terimakasih!</p><hr>" +
                "<p>Nama Pelapor : <a href='mailto:" + email + "'>" + name + "</a><br>" +
                "Alamat Email : <a href='mailto:" + email + "'>" + email + "</a><br>" +
                "Slug Tempat Terlapor : " + placeID + "</p>"
        };

        //Mengirim Email
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Sukses Kirim Email");
            }
        })
        return res.json({
            message: "Sukses mengirim email",
            data: {id: placeID}
        })
    } catch (error) {
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: "Error"});
    }

}

const placeDetailPage = async (req, res) => {
    const loadJS = [
        {src: "https://unpkg.com/swiper/swiper-bundle.min.js"},
        {src: "/assets/js/side-nav-bar.js"},
        {src: "/assets/js/place-detail.js"}
    ];
    const loadCSS = [
        {src: "https://unpkg.com/swiper/swiper-bundle.min.css"},
        {src: "/assets/styles/side-nav-bar.css"},
    ];
    try {
        const {slug} = req.params;
        const place = await Place.findOne({is_draft: false, slug});
        if (!place) throw {code: 404, message: "404 Not Found"};
        let views = 0;
        if (place.views) views = place.views;
        views = views + 1;
        const update = await Place.updateOne({slug: place.slug}, {$set: {views: views}});
        let menus = await Menu.find({placeId: place._id, is_draft: false});
        menus = place.menu_categories.map(e => {
            let menu_docs = menus.filter(e1 => (e == e1.category)).map(e1 => {
                let doc = e1._doc;
                doc.prices.normal_price = new Intl.NumberFormat().format(doc.prices.normal_price).replace(',', '.');
                doc.prices.sale_price = new Intl.NumberFormat().format(doc.prices.sale_price).replace(',', '.');
                return doc;
            });
            return {category: e, menus: menu_docs};
        }).filter(e => (e.menus.length > 0));
        const day = dtlib.getTodayId();
        const [todayOT] = place.operational_times.filter(e => (e.day == day));
        const isTodayOpen = dtlib.isPlaceOpen(todayOT);
        const lastUpdate = moment(place.updatedAt).format(dtlib.formats.lastUpdate);
        let payments = place.payments.map(e => (e.name));
        let ctas = {};
        place.call_to_actions.forEach(e => {
            if (e.value != '') ctas[e.type] = e.value;
            if (e.draft) {
                if (e.draft === true) {
                    ctas[e.type] = '';
                }
            }
        })
        payments = payments.length > 0 ? payments.join(', ') : 'Belum ada informasi';
        const city = place.city.charAt(0).toUpperCase() + place.city.slice(1);
        var paymentscat = [];
        place.payment_detail.forEach(e => {
            var feed = {
                type: e.type,
                detail: []
            };
            paymentscat.push(feed);
        });
        //remove duplicate
        var seenNames = {};
        paymentscat = paymentscat.filter(function (currentObject) {
            if (currentObject.type in seenNames) {
                return false;
            } else {
                seenNames[currentObject.type] = true;
                return true;
            }
        });
        //Push Detail
        for (var i = 0; i < paymentscat.length; i++) {
            place.payment_detail.forEach(a => {
                if (paymentscat[i].type === a.type) {
                    var feed = {
                        name: a.name,
                        condition: a.condition
                    };
                    paymentscat[i].detail.push(feed);
                }
            });
        }
        //
        res.locals.pageTitle = place.name + ", " + city + " - Info menu digital terbaru dari emam.id"
        return res.render('place-detail', {
            place,
            menus,
            day,
            todayOT,
            isTodayOpen,
            lastUpdate,
            payments,
            ctas,
            paymentscat,
            loadJS,
            loadCSS
        });
    } catch (error) {
        console.log(error);
        if (error.code == 404)
            return res.status(error.code).send(error.message)
        return res.send('');
    }
}

module.exports = {
    homePage, placeDetailPage, allPlace, claimBusiness, getPlaceCategory, categoryPage, tellUs, sendEmail,
    allpartner
};
