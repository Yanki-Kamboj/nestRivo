
const {Home}=require('../models/home')
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.uploadPhoto =upload.single("photo");

exports.addHome = (req, res, next) => {
    res.render("host/add-home");
};


exports.registerHome = async (req, res, next) => {
    const {houseName,price,location,rating}=req.body;
    const photo=req.file?req.file.filename:null;
    const home= new Home(houseName,price,location,rating,photo);
    try {
        await home.save();
        console.log("Home saved successfully");
        res.render("host/register");
    } catch (error) {
        next(error);
    }
};

exports.getHomelist=async (req,res,next)=>{
    try {
        const homes=await Home.fetchAll();
        res.render("host/hostHomeList",{homes});
    } catch (error) {
        next(error);
    }
};
exports.getEditHome=async (req,res,next)=>{
    try {
        const home=await Home.findById(req.params.homeId);
        if(!home){
            res.redirect('/host/home-list');
            return;
        }
        res.render("host/editHome",{home});
    } catch(error) {
        next(error);
    }
};

exports.updateHome=async (req,res,next)=>{
    const {houseName,price,location,rating}=req.body;
    const updates={houseName,price,location,rating};
    if(req.file){
        updates.photo=`/uploads/${req.file.filename}`;
    }
    try {
        const updated=await Home.updateById(req.params.homeId,updates);
        if(!updated){
            return res.redirect('/host/home-list');
        }
        res.redirect('/host/home-list');
    } catch(error) {
        next(error);
    }
};

exports.postdeleteHome=async (req,res,next)=>{
    try {
        await Home.deleteById(req.params.homeId);
        res.redirect('/host/home-list');
    } catch(error) {
        next(error);
    }
};
