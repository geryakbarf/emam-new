const express = require('express')

const router = express.Router()
const v1 = express.Router()

const ownerHanlder = require('../handlers/v1/owners');
const placeCatHandler = require('../handlers/v1/place_categories');
const cuisineHandler = require('../handlers/v1/cuisines');
const paymentHandler = require('../handlers/v1/payments');
const facilityHandler = require('../handlers/v1/facilities');
const covidHandler = require('../handlers/v1/covids');
const placeHandler = require('../handlers/v1/places');
const menuHandler = require('../handlers/v1/menus');
const imageHandler = require('../handlers/v1/images');
const webHandler = require('../handlers/v1/web');
const approvalHandler = require('../handlers/v1/approvals');

v1.get('/place-categories', placeCatHandler.getAll)
v1.get('/cuisines', cuisineHandler.getAll)
v1.get('/payments', paymentHandler.getAll)
v1.get('/paymentscat', paymentHandler.getPaymentCategory)
v1.get('/facilities', facilityHandler.getAll)
v1.get('/covid-protocols', covidHandler.getAll)

v1.get('/owners', ownerHanlder.getAllOwners)
v1.post('/owners', ownerHanlder.addOwner)
v1.get('/owners/:id', ownerHanlder.getOneOwner)
v1.put('/owners', ownerHanlder.updateOwner)
v1.post('/owners-insert', ownerHanlder.insertPlacetoList);
v1.delete('/owners-delete/:id',ownerHanlder.deleteOwner);

v1.get('/places/:id/owner',ownerHanlder.getOwnerPlaceStatus)
v1.get('/places', placeHandler.getPlaces)
v1.get('/places/:id', placeHandler.getOnePlace)
v1.get('/places/:id/menu-categories', placeHandler.getMenuCategoriesPlace)
v1.put('/places/:id/menu-categories', placeHandler.saveMenuCategoriesPlace)
v1.get('/places/:id/menus', menuHandler.getMenusByPlaceId)
v1.post('/places', placeHandler.createPlace)
v1.put('/places', placeHandler.updatePlace)
v1.delete('/places/:id', placeHandler.deletePlace)
v1.post('/places/owner', placeHandler.getOwnerPlace)
v1.get('/searchplaces', placeHandler.searchPlace)

v1.get('/menus', menuHandler.getMenus)
v1.get('/menus/:id', menuHandler.getOneMenu)
v1.post('/menus', menuHandler.createMenu)
v1.put('/menus', menuHandler.updateMenu)
v1.delete('/menus/:id', menuHandler.deleteMenu)

v1.post('/upload-image-s3', imageHandler.uploadImageS3)
v1.delete('/delete-images', imageHandler.deleteImages)
v1.post('/claim/send-claim', placeHandler.insertClaim)
v1.post('/tell-us', webHandler.sendEmail)

v1.get('/approvals', approvalHandler.getRequestedPlaces)
v1.get('/approvals/:id', approvalHandler.getOneRequestedPlace)
v1.put('/approvals/accept', approvalHandler.acceptRequest)
v1.put('/approvals/reject', approvalHandler.rejectRequest)

router.use('/v1', v1);

module.exports = router
