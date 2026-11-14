
const {Home}=require('../models/home');
const Favourite = require('../models/favourites');
exports.getHome=async (req,res,next)=>{
    try {
        const homes=await Home.fetchAll();
        res.render("store/homeList",{homes});
    } catch (error) {
        next(error);
    }
};
exports.getBooking=(req,res,next)=>{
    res.render("store/booking");
};

exports.getFavroites=async (req,res,next)=>{
    try {
        const favouriteIds=await Favourite.getFavourites();
        const homes=await Home.fetchAll();
        const favorites=homes.filter(home=>favouriteIds.includes(home.id));
        res.render("store/favouritelist",{favorites});
    } catch (error) {
        next(error);
    }
};
exports.getHomeDetails=async (req,res,next)=>{
    try {
        const home=await Home.findById(req.params.homeId);
        if(!home){
            res.redirect('/home-list');
            return;
        }
        res.render("store/home-detail",{home});
    } catch(error) {
        next(error);
    }
};
exports.postFavroites=async (req,res,next)=>{
    try {
        const home=await Home.findById(req.body.id);
        if(!home){
            return res.redirect('/home-list');
        }
        await Favourite.addToFavourite(home.id);
        res.redirect('/favourites');
    } catch(error) {
        next(error);
    }
};
exports.postRemoveFavourite=async (req,res,next)=>{
    try {
        await Favourite.removeFromFavourite(req.body.id);
        res.redirect('/favourites');
    } catch(error) {
        next(error);
    }
};
