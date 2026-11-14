const express=require('express');
const {getHome,getBooking,getFavroites,getHomeDetails,postFavroites,postRemoveFavourite}=require('../controllers/storeController')
const storeRouter=express.Router();

storeRouter.get('/home-list',getHome);
storeRouter.get('/booking',getBooking);

storeRouter.get('/favourites',getFavroites);
storeRouter.get('/home/:homeId',getHomeDetails);

storeRouter.post('/favorites',postFavroites);
storeRouter.post('/favorites/remove',postRemoveFavourite);
module.exports=storeRouter;