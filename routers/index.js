module.exports = (app) => {
    app.use(require('./web'))
    app.use('/admin',require('./admin'))
    app.use('/api',require('./api'))
    app.use('/panel/owner',require('./owner'))
    app.use('/panel/ceo',require('./ceo'))
    //404
    app.use((req,res)=>{
        res.status(404).render('404');
    })
}
