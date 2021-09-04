const express = require('express');
const adm_auth = require('../middlewares/owner_auth')
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
    res.locals.title = "Owner | Emam Indonesia"
    next();
});

router.get('/login', (req, res) => {
    if (req.session.isOwner)
        return res.redirect('/panel/owner/');
    else
        return res.render('owner/login')
})

router.get('/register', (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/admin/form_owner.js"},
    ];
    return res.render('owner/register', {loadCSS: formPageCSS, loadJS: formPageJS})
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const login = await Owner.findOne({username: username, password: password})
    if (login != null) {
        req.session.isOwner = true;
        req.session.owner = login._id;
        return res.redirect('/panel/owner/');
    }
    return res.render('owner/login', {errMsg: "username or password invalid"});
})


router.use(adm_auth);

router.get('/', (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/owner/list_place.js"},
    ];
    const loadCSS = [
        ...formPageCSS
    ]
    return res.render('owner/index', {loadJS, loadCSS,id: req.session.owner})
})

router.get('/places/new', async (req, res) => {
    return res.render('owner/new-place', {loadJS: formPageJS, loadCSS: formPageCSS,id: req.session.owner})
})

router.get('/places/:id/edit', (req, res) => {
    const placeId = req.params.id;
    const ownerId = req.session.owner;
    return res.render('owner/edit-place', {loadJS: formPageJS, loadCSS: formPageCSS, placeId, ownerId})
})

router.get('/places/:placeId/menus/new', async (req, res) => {
    try {
        const {placeId} = req.params;
        const ownerId = req.session.owner;
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
        return res.render('owner/new-menu', {loadJS, loadCSS: formPageCSS, placeId, ownerId})
    } catch (error) {
        return res.redirect('/panel/owner/');
    }

})

router.get('/places/:placeId/menus/:menuId', async (req, res) => {
    try {
        const {placeId, menuId} = req.params;
        const ownerId = req.session.owner;
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
        return res.render('owner/edit-menu', {loadJS, loadCSS: formPageCSS, placeId, menuId, ownerId})
    } catch (error) {
        return res.redirect('/panel/owner/');
    }

})

router.get('/owners/edit', async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/admin/form_owner.js"},
    ];
    const id = req.session.owner;
    const ownerId = req.session.owner;
    return res.render('owner/edit-owner', {loadJS: loadJS, loadCSS: formPageCSS, id, ownerId})
})

router.get('/owners/:id/places/new', async (req, res) => {
    const loadCSS = [
        {src: "https://unpkg.com/vue-select@latest/dist/vue-select.css"},
        {src: "/assets/styles/add-to-foodlist.css"}
    ];

    const loadJS = [
        ...frontend.vueDeps,
        {src: "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js"},
        {src: "https://unpkg.com/vue-select@latest"},
        {src: "https://unpkg.com/sweetalert/dist/sweetalert.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/admin/add_to_list.js"},
    ];
    const {id} = req.params;
    const ownerId = req.session.owner;
    return res.render('admin/add-to-foodlist', {loadJS: loadJS, loadCSS: loadCSS, id, ownerId})
})

router.get('/logout', (req, res) => {
    delete req.session.isOwner
    delete req.session.owner
    return res.redirect('owner/login')
})

module.exports = router
