const Menu = require('../../data/mongo/menus');

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin."

const createMenu = async(req,res) => {
    try {
        const menu = await Menu.create(req.body);
        return res.json({
            message: "Success to create menu",
            data: {id: menu._id}
        });    
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
    
}

const updateMenu = async(req,res) => {
    try {
        const {_id, ...data} = req.body;
        const menu = await Menu.updateOne({_id}, data);
        return res.json({
            message: "Success to update menu",
            data: {id: menu._id}
        });    
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
    
}

const getMenus = async(req, res) => {
    try {
        const data = await Menu.find();
        return res.json({message: "Success to retrive menus", data})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getMenusByPlaceId = async(req, res) => {
    try {
        const data = await Menu.find({placeId: req.params.id});
        return res.json({message: "Success to retrive menus", data})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getOneMenu = async(req, res) => {
    try {
        const data = await Menu.findOne({_id: req.params.id});
        return res.json({message: "Success to retrive menus", data})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const deleteMenu = async(req, res) => {
    try {
        const menu = await Menu.findOne({_id: req.params.id});
        await menu.delete();
        return res.json({message: "Success to delete menu"})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

module.exports = {
    getMenus,
    getOneMenu,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenusByPlaceId
}