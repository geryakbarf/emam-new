module.exports = {
    commingsoon: function (req, res, next) {
        if (process.env.COMINGSOON && process.env.COMINGSOON == 'true') {
            return res.redirect('coming-soon');
        }
        next();
    },
    routePath: function (req, res, next) {
        res.locals.routePath = req.route.path;
        console.log(req.route.path);
        next();
    }
}
