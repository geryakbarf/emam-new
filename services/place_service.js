const axios = require('axios');
const {API_BACKEND_URL} = process.env;

const defaultHeaders = {
    'Content-Type': "application/json",
    'origin': "https://emam.id"
}

const flagWishListedPlace = async ({places, session}) => {
    try {
        const {user, accessToken} = session.web;
        const headers = {...defaultHeaders, 'authorization': "Bearer "+accessToken }
        const resp = await axios.get(`${API_BACKEND_URL}/v1/wishlist?ownerID=${user._id}`, {headers});
        let {data: wishlist} = resp.data;
        if(wishlist){
            wishlist = wishlist.map(e => (e._id)); 
            places = places.map(e => {
                let id = e._id.toString();
                e = e._doc;
                e.is_liked = wishlist.indexOf(id) != -1;
                return e;
            })
        }
            
        return Promise.resolve(places);
    } catch (error) {
        console.error(error)
        return Promise.resolve(places);
    }
}


module.exports = {
    flagWishListedPlace
}