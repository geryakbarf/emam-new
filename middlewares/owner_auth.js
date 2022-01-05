module.exports = function(req,res, next) {
    if(!req.session.isOwner){
        return res.redirect('/panel/owner/login');
    }
    next();
}