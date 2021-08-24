module.exports = (req, res, next)=>{
    res.locals.title = "Emam Indonesia";
    res.locals.FB_ENABLE = process.env.FB_ENABLE;
    res.locals.FB_APIKEY = process.env.FB_APIKEY;
    res.locals.FB_AUTH_DOMAIN = process.env.FB_AUTH_DOMAIN;
    res.locals.FB_DB_URL = process.env.FB_DB_URL;
    res.locals.FB_PROJECT_ID = process.env.FB_PROJECT_ID;
    res.locals.FB_STORAGE_BUCKET = process.env.FB_STORAGE_BUCKET;
    res.locals.FB_MESSANGER_SENDER_ID = process.env.FB_MESSANGER_SENDER_ID;
    res.locals.FB_APP_ID = process.env.FB_APP_ID;
    res.locals.FB_MEASUREMENT_ID = process.env.FB_MEASUREMENT_ID;
    res.locals.API_BACKEND_URL = process.env.API_BACKEND_URL;
    next();
}