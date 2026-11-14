const Favourite=require('./favourites');
const {ObjectId}=require('mongodb');
const {getDb}=require('../utils/databaseUtils');

const getObjectId=(homeId)=>{
    if(typeof homeId!=='string'||! /^[0-9a-fA-F]{24}$/.test(homeId)){
        return null;
    }
    return new ObjectId(homeId);
};

class Home {
    constructor(houseName,price,location,rating,photo){
      this.houseName=houseName
      this.price=price;
      this.location=location;
      this.rating=rating;
      this.photo=photo?(photo.startsWith('/uploads/')?photo:`/uploads/${photo}`):null;
    }
    save(){
        const db=getDb();
        return db.collection('homes').insertOne(this);
    }
    static async fetchAll(){
        const db=getDb();
        const homes=await db.collection('homes').find().sort({_id: -1}).toArray();
        return homes.map(home=>({
            ...home,
            id:home._id.toString()
        }));
    }
   
    static async findById(homeId) {
        const objectId=getObjectId(homeId);
        if(!objectId){
            return null;
        }
        const home=await getDb().collection('homes').findOne({_id:objectId});
        return home?{...home,id:home._id.toString()}:null;
    }

    static async updateById(homeId, updates) {
        const objectId=getObjectId(homeId);
        if(!objectId){
            return false;
        }
        const allowedFields=['houseName','price','location','rating','photo'];
        const fields=Object.fromEntries(
            Object.entries(updates).filter(([key,value])=>allowedFields.includes(key)&&value!==undefined)
        );
        if(Object.keys(fields).length===0){
            return false;
        }
        const result=await getDb().collection('homes').updateOne(
            {_id:objectId},
            {$set:fields}
        );
        return result.matchedCount>0;
    }

    static async deleteById(homeId) {
        const objectId=getObjectId(homeId);
        if(!objectId){
            return false;
        }
        const result=await getDb().collection('homes').deleteOne({_id:objectId});
        if(result.deletedCount===0){
            return false;
        }
        await Favourite.removeFromFavourite(objectId.toHexString());
        return true;
    }
}




module.exports={
    Home,
}
