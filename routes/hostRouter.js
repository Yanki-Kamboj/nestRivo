const express=require('express');

const {addHome,registerHome,getHomelist,getEditHome,updateHome,uploadPhoto,postdeleteHome}=require('../controllers/hostController');
const hostRouter=express.Router();



hostRouter.get('/add-home',addHome);

hostRouter.post('/register',uploadPhoto,registerHome);
exports.hostRouter=hostRouter;

hostRouter.get('/home-list',getHomelist);

hostRouter.get('/edit-home/:homeId', getEditHome);
hostRouter.post('/edit-home/:homeId', uploadPhoto, updateHome);
hostRouter.post('/delete-home/:homeId', postdeleteHome);

