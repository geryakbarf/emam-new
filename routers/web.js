const express = require("express");
const imageHandler = require("../handlers/v1/images");
const common = require("../middlewares/common");
const web = require("../handlers/v1/web");
const axios = require("axios");
const placeHandler = require("../handlers/v1/places");
const foodlistHandler = require("../handlers/v1/foodlist");
const frontend = require("../libs/frontend");
const router = express.Router();

router.use(async(req, res, next) => {
    res.locals.pageTitle = "Kulineran aman dengan menu digital - emam.id";
    if (req.session.web && req.session.web.user == null) {
        try {
            console.log(req.session.web);
            const { accessToken } = req.session.web;
            const baseURL = process.env.API_BACKEND_URL;
            const response = await axios.get(baseURL + "/v1/me", {
                headers: {
                    'Content-Type': "application/json",
                    'authorization': "Bearer " + accessToken,
                    'origin': "https://emam.id"
                }
            });

            const { data } = response.data;
            if (data) req.session.web.user = data;
            return next();
        } catch (error) {
            console.error(error.message);
            return next();
        }

    } else if (req.session.web && req.session.web.user) {
        res.locals.user = req.session.web.user;
        next();
    } else {
        next();
    }
});

router.get("/", common.routePath, common.commingsoon, web.homePage);

router.get("/explore", web.allPlace);

router.get('/partner', web.allpartner);

router.get("/claim/:slug", web.claimBusiness);

router.get("/search-places", placeHandler.searchPlacesAndMenus);

router.get("/explore/category/:category", web.getPlaceCategory);

router.get("/explore/category", web.categoryPage);

router.post("/fetch_food.php", (req, res) => {
    res.send(`
    <div class="show-search" align="left">
        <a href="detailtempat.php?id=Didago-Cafe-Dago-Bandung">
            <img src="https://emam.id/images/database/tempatmakan/emam-didago-cover.png" style="width:50px; height:50px; float:left; margin-right:6px;" />
            <div class="text-info-tempat" style=""><span class="name">Di<strong>dago</strong> Cafe</span>&nbsp;<br />Jl. Ir. H. Juanda No.21, Kota Bandung (setelah DEKRANASDA Jawa Barat)<br /></div>
        </a>
    </div>

    `);
});

router.get("/about", common.routePath, (req, res) => {
    res.locals.pageTitle = "Tentang kami - emam.id";
    res.render("about");
});

router.get("/blog", common.commingsoon, (req, res) => {
    res.redirect("/under-construction");
});

router.get("/sess", async(req, res) => {
    const { token } = req.query;
    if (token) {
        try {
            const baseURL = process.env.API_BACKEND_URL;
            const response = await axios.get(baseURL + "/v1/me", {
                headers: {
                    'Content-Type': "application/json",
                    'authorization': "Bearer " + token,
                    'origin': "https://emam.id"
                }
            });

            const { data } = response.data;
            if (data) {
                req.session.web = { accessToken: token, user: data };
                res.locals.user = data;
            }
            return res.redirect("/");
        } catch (error) {
            console.error(error);
            return res.redirect("/");
        }
    } else {
        res.redirect("/");
    }

});

router.get("/logout", (req, res) => {
    delete req.session.web;
    res.redirect("/");
});


router.get("/setting-profile", (req, res) => {
    res.locals.pageTitle = "Setting profile - emam.id";
    res.render("setting-profile");
});

router.get("/foodlist/new", (req, res) => {
    res.locals.pageTitle = "Tambah foodlist - emam.id";
    if (!req.session.web) res.redirect("/");
    const loadJS = [
        ...frontend.vueDeps,,
        { src: "/assets/js/foodlist/form.js" },
    ];
    res.render("form-foodlist", { loadJS, foodListID: null });
});

router.get("/foodlist/:foodListID/edit", (req, res) => {
    res.locals.pageTitle = "Edit foodlist - emam.id";
    if (!req.session.web) res.redirect("/");
    const { foodListID } = req.params;
    const loadJS = [
        ...frontend.vueDeps,
        { src: "/assets/js/foodlist/form.js" },
    ];
    res.render("form-foodlist", { loadJS, foodListID });
});

router.get("/foodlist/:foodListID", foodlistHandler.showFoodlist);
router.get("/foodlist/:foodListID/add-place", foodlistHandler.addPlace);
router.get("/foodlist/:foodListID/edit-place", foodlistHandler.editPlace);

router.get("/business", common.commingsoon, (req, res) => {
    res.redirect("/under-construction");
});

router.get("/contact-us", common.commingsoon, (req, res) => {
    res.locals.pageTitle = "Hubungi kami - emam.id";
    res.render("about");
});

router.get("/under-construction", common.commingsoon, (req, res) => {
    res.locals.pageTitle = "Underconstruction - emam.id";
    res.render("underconstruction");
});

router.get("/coming-soon", (req, res) => {
    res.locals.pageTitle = "Segera hadir - emam.id";
    res.render("coming-soon");
});

router.get("/auth", (req, res) => {
    if(req.session.web) return res.redirect('/');
    res.locals.pageTitle = "Authentikasi";
    const loadJS = [
        ...frontend.vueDeps,
        { src: "/assets/js/auth.js" },
    ];
    res.render("login", { loadJS });
});

router.get("/profile", (req, res) => {
    if(!req.session.web) return res.redirect('/auth');
    res.locals.pageTitle = "Profile - emam.id";
    const loadJS = [
        ...frontend.vueDeps,
        { src: "/assets/js/profile/user-section.js" },
        { src: "/assets/js/profile/wishlist-tab.js" },
        { src: "/assets/js/profile/foodlist-tab.js" },
        { src: "/assets/js/profile/tab-section.js" },
        { src: "/assets/js/profile/main.js" },
    ];
    res.render("profile", { loadJS, username: null });
});

router.get("/profile/:username", (req, res) => {
    res.locals.pageTitle = "Profile - emam.id";
    const {username} = req.params;
    const loadJS = [
        ...frontend.vueDeps,
        { src: "/assets/js/profile/user-section.js" },
        { src: "/assets/js/profile/wishlist-tab.js" },
        { src: "/assets/js/profile/foodlist-tab.js" },
        { src: "/assets/js/profile/tab-section.js" },
        { src: "/assets/js/profile/main.js" },
    ];
    res.render("profile", { loadJS, username });
});

router.get("/tell-us/:slug", web.tellUs)

router.get("/p/:slug", common.commingsoon, web.placeDetailPage);

router.get("/qr/:slug", common.commingsoon, web.placeDetailPage);

router.get("/images/:key", imageHandler.getImage);

module.exports = router;