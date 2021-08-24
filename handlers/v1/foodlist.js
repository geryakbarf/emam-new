const axios = require('axios');
const frontend = require('../../libs/frontend');
const {API_BACKEND_URL} = process.env;

const showFoodlist = async (req, res) => {
    let headers = {'Content-Type': "application/json", 'origin': "https://emam.id"};

    const {foodListID} = req.params;
    if (req.session.web) {
        const {accessToken} = req.session.web;
        if (accessToken) headers.authorization = "Bearer " + accessToken;
    }
    try {
        const resp = await axios.get(`${API_BACKEND_URL}/v1/foodlist-detail?foodlistID=${foodListID}`, {headers});
        const {data} = resp.data;
        if (resp.status != 200) return res.status(404).render('404-foodlist');
        if (data.is_private && !data.is_owned) return res.status(404).render('404-foodlist');
        res.locals.pageTitle = `${data.nama} - Food list emam.id`;
        
        const loadJS = [
            ...frontend.vueDeps,
            {src: "/assets/js/foodlist/detail.js"},
        ]
        return res.render("foodlist", {foodlist: data, loadJS});    
    } catch (error) {
        return res.status(404).render('404-foodlist');
    }
    
}

const addPlace = async (req, res) => {
    let headers = {'Content-Type': "application/json", 'origin': "https://emam.id"};
    if (!req.session.web) return res.redirect('/auth');
    res.locals.pageTitle = `Tambah tempat - Food list emam.id`;

    const loadCSS = [
        {src: "https://unpkg.com/vue-select@latest/dist/vue-select.css"},
        {src: "/assets/styles/add-to-foodlist.css"}
    ]
    const loadJS = [
        ...frontend.vueDeps,
        {src: "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js"},
        {src: "https://unpkg.com/vue-select@latest"},
        {src: "https://unpkg.com/sweetalert/dist/sweetalert.min.js"},
        {src: "/assets/js/foodlist/add_to_list.js"},
    ];

    const {foodListID} = req.params;

    if (req.session.web) {
        const {accessToken} = req.session.web;
        if (accessToken) headers.authorization = "Bearer " + accessToken;
    }
    const resp = await axios.get(`${API_BACKEND_URL}/v1/foodlist-detail?foodlistID=${foodListID}`, {headers});
    const {data: foodList} = resp.data;
    if (resp.status != 200) return res.status(404).render('404');


    res.render("add-to-foodlist", {foodList, loadJS, loadCSS});
}


const editPlace = async (req, res) => {
    let headers = {'Content-Type': "application/json", 'origin': "https://emam.id"};
    if (!req.session.web) return res.redirect('/auth');
    const loadJS = [
        ...frontend.vueDeps,
        {src: "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js"},
        {src: "/assets/js/foodlist/edit-place.js"},
    ];

    const {foodListID} = req.params;
    const {placeID} = req.query;

    if (req.session.web) {
        const {accessToken} = req.session.web;
        if (accessToken) headers.authorization = "Bearer " + accessToken;
    }
    const resp = await axios.get(`${API_BACKEND_URL}/v1/foodlist-detail?foodlistID=${foodListID}`, {headers});
    const {data: foodList} = resp.data;
    if (resp.status != 200) return res.status(404).render('404');
    const [place] = foodList.listPlaces.filter(e => e._id == placeID);
    if (!place) return res.status(404).render('404');

    return res.render("edit-place-foodlist", {place, foodList, loadJS});
}
module.exports = {
    showFoodlist,
    addPlace,
    editPlace
}