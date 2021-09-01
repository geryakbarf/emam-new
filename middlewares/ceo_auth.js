module.exports = function(req,res, next) {
    if(!req.session.isCeo){
        return res.redirect('/panel/ceo/login');
    }
    next();
}
