const express = require('express');
const adm_auth = require('../middlewares/ceo_auth')
const Place = require('../data/mongo/places');
const Menu = require('../data/mongo/menus');
const Admin = require('../data/mongo/admin');
const Owner = require('../data/mongo/places_owner');
const frontend = require('../libs/frontend');

let formPageJS = [
    {src: "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.4/tinymce.min.js"},
    {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
    {src: "https://unpkg.com/@johmun/vue-tags-input@2.1.0/dist/vue-tags-input.js"},
    {src: "https://cdn.jsdelivr.net/g/lodash@4(lodash.min.js+lodash.fp.min.js)"},
    {src: "https://cdn.jsdelivr.net/npm/slugify-js@0.0.2/src/slugify.min.js"},
    {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
    {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
    {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
    {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
    {src: "https://cdn.jsdelivr.net/combine/npm/qrcanvas@3,npm/qrcanvas-vue@2"},
    {src: "https://cdn.jsdelivr.net/npm/vue-easy-tinymce/dist/vue-easy-tinymce.min.js"},
    {src: "/assets/js/admin/form_place.js"},
    {src: "/assets/js/admin/form_owner.js"},
];
const formPageCSS = [
    {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
]

const router = express.Router()

router.use((req, res, next) => {
    res.locals.title = "CEO | Emam Indonesia"
    next();
});

router.get('/login', (req, res) => {
    if (req.session.isCeo)
        return res.redirect('/panel/ceo/');
    else
        return res.render('ceo/login')
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if (email == "zaki@emam.id" && password == "zaki123") {
        req.session.isCeo = true;
        req.session.ceoname = "Zaki";
        return res.redirect('/panel/ceo/');
    }
    return res.render('ceo/login', {errMsg: "username or password invalid"});
})


router.use(adm_auth);

router.get('/', (req, res) => {
  let ceo = req.session.ceoname;
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/list_approval.js"},
    ];
    const loadCSS = [
        ...formPageCSS
    ]
    return res.render('ceo/approvals', {loadJS, loadCSS})
})

router.get('/places/:id/edit', (req, res) => {
    const placeId = req.params.id;
    req.session.placeId = placeId;
    let ceo = req.session.ceoname;
    return res.render('ceo/edit-place', {loadJS: formPageJS, loadCSS: formPageCSS,id: placeId, ceo})
})

router.get('/places/:placeId/menus/new', async (req, res) => {
    try {
        const {placeId} = req.params;
        let ceo = req.session.ceoname;
        const place = await Place.findOne({_id: placeId});
        if (!place) throw {code: 404, message: "Place not found"};
        const loadJS = [
            {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
            {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
            {src: "/assets/js/admin/form_menu.js"},
        ]
        return res.render('ceo/new-menu', {loadJS, loadCSS: formPageCSS, placeId, ceo})
    } catch (error) {
        return res.redirect('/panel/ceo/');
    }

})

router.get('/places/:placeId/menus/:menuId', async (req, res) => {
    try {
      let ceo = req.session.ceoname;
        const {placeId, menuId} = req.params;
        const place = await Place.findOne({_id: placeId});
        if (!place) throw {code: 404, message: "Place not found"};
        const menu = await Menu.findOne({_id: menuId});
        if (!menu) throw {code: 404, message: "Menu not found"};
        const loadJS = [
            {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
            {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
            {src: "/assets/js/admin/form_menu.js"},
        ]
        return res.render('ceo/edit-menu', {loadJS, loadCSS: formPageCSS, placeId, menuId, ceo})
    } catch (error) {
        return res.redirect('/panel/ceo/');
    }

})

router.get('/owners/:id/edit', async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/admin/form_owner.js"},
    ];
    let ceo = req.session.ceoname;
    const {id} = req.params;
    const place = req.session.placeId;
    return res.render('ceo/edit-owner', {loadJS: loadJS, loadCSS: formPageCSS, id, ceo, place})
})

router.get('/message', (req, res) => {
  let ceo = req.session.ceoname;
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/list_message.js"},
    ];
    const loadCSS = [
        ...formPageCSS
    ]
    return res.render('ceo/message', {loadJS, loadCSS, ceo})
})

router.get('/message/:id/reject', async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/form_message.js"},
    ];
    let ceo = req.session.ceoname;
    const {id} = req.params;
    const place = req.session.placeId;
    const subject = "Rejection";
    return res.render('ceo/send-message', {loadJS: loadJS, loadCSS: formPageCSS, id, ceo, place, subject})
})

router.get('/message/:id/accept', async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/form_message.js"},
    ];
    let ceo = req.session.ceoname;
    const {id} = req.params;
    const place = req.session.placeId;
    const subject = "Accepted";
    return res.render('ceo/send-message', {loadJS: loadJS, loadCSS: formPageCSS, id, ceo, place, subject})
})

router.get('/message/:id/view', async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/form_message.js"},
    ];
    const {id} = req.params;
    return res.render('ceo/view-message', {loadJS: loadJS, loadCSS: formPageCSS, id})
})

router.get('/message/new', async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/form_message.js"},
    ];
    let ceo = req.session.ceoname;
    return res.render('ceo/send-message', {loadJS: loadJS, loadCSS: formPageCSS, ceo})
})

router.get('/logout', (req, res) => {
    delete req.session.isCeo
    delete req.session.ceoname
    return res.redirect('ceo/login')
})

router.get('/owners', (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/list_owner.js"},
    ];
    let ceo = req.session.ceoname;
    const loadCSS = [
        ...formPageCSS
    ]
    return res.render('ceo/owner', {loadJS, loadCSS, name: req.session.admin})
})

router.get('/owners/:id/view', async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/ceo/form_owner.js"},
    ];
    let ceo = req.session.ceoname;
    const {id} = req.params;
    return res.render('ceo/view-owner', {loadJS: loadJS, loadCSS: formPageCSS, id})
})

// ---------

router.get('/income', async (req, res) => {
    let owner = await Owner.find();
    let totalSubs = 0;
    let totalGold = 0;
    let totalSilver = 0;
    let incomeGold = 0;
    let incomeSilver = 0;
    let incomeSub = 0;
    let totalAddon = 0;
    let totalEmam = 0;
    let totalIG = 0;
    let totalDouble = 0;
    let incomeEmam = 0;
    let incomeIG = 0;
    let incomeDouble = 0;
    let incomeAddon = 0;
    let totalIncome = 0;
    for (var i = 0; i < owner.length; i++) {
        if (owner[i].subscription || owner[i].subscription !== "") {
            totalSubs = totalSubs + 1;
            if (owner[i].subscription === "Gold") {
                incomeGold = incomeGold + 25000;
                totalGold = totalGold + 1;
            } else {
                incomeSilver = incomeSilver + 20000;
                totalSilver = totalSilver + 1;
            }
        }
        //
        if (owner[i].addons || owner[i].addons !== "") {
            totalAddon = totalAddon + 1;
            if (owner[i].addons === "Emam") {
                incomeEmam = incomeEmam + 5000;
                totalEmam = totalEmam + 1;
            } else if (owner[i].addons === "Instagram") {
                incomeIG = incomeIG + 10000;
                totalIG = totalIG + 1;
            } else {
                incomeDouble = incomeDouble + 15000;
                totalDouble = totalDouble + 1;
            }
        }
    }
    incomeSub = incomeGold + incomeSilver;
    incomeAddon = incomeIG + incomeDouble + incomeEmam;
    totalIncome = incomeSub + incomeAddon;
    income = {
        totalSubs: totalSubs,
        totalAddon: totalAddon,
        totalGold: totalGold,
        totalSilver: totalSilver,
        totalEmam: totalEmam,
        totalIG: totalIG,
        totalDouble: totalDouble,
        incomeSub: incomeSub,
        incomeGold: incomeGold,
        incomeSilver: incomeSilver,
        incomeAddon: incomeAddon,
        incomeEmam: incomeEmam,
        incomeIG: incomeIG,
        incomeDouble: incomeDouble,
        totalIncome: totalIncome
    }
    console.log(income);
    return res.render('ceo/income', {income})
})

module.exports = router
