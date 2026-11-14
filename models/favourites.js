const fs=require('fs').promises;
const path=require('path');
const {ObjectId}=require('mongodb');
const rootDir=require('../utils/pathUtils');
const {getDb}=require('../utils/databaseUtils');

const legacyFavouritesPath=path.join(rootDir,'data','favourites.json');
const migrationId='legacy-favourites-json-v1';
let migrationPromise;

const getObjectId=(homeId)=>{
    if(typeof homeId!=='string'||! /^[0-9a-fA-F]{24}$/.test(homeId)){
        return null;
    }
    return new ObjectId(homeId);
};

const migrateLegacyFavourites=()=>{
    if(!migrationPromise){
        migrationPromise=(async()=>{
            const collection=getDb().collection('favourites');
            const migration=await collection.findOne({_id:migrationId});
            if(migration){
                return;
            }

            let legacyIds=[];
            try {
                const data=await fs.readFile(legacyFavouritesPath,'utf8');
                const parsed=JSON.parse(data);
                if(!Array.isArray(parsed)){
                    throw new TypeError('Legacy favourites data must be a JSON array');
                }
                legacyIds=parsed.filter(id=>typeof id==='string'&&/^[0-9a-fA-F]{24}$/.test(id));
            } catch(error) {
                if(error.code!=='ENOENT'){
                    throw error;
                }
            }

            if(legacyIds.length){
                await collection.bulkWrite(legacyIds.map(id=>{
                    const homeId=new ObjectId(id);
                    return {
                        updateOne:{
                            filter:{_id:homeId},
                            update:{$setOnInsert:{homeId,createdAt:new Date()}},
                            upsert:true
                        }
                    };
                }));
            }

            await collection.updateOne(
                {_id:migrationId},
                {$setOnInsert:{migration:'legacy-favourites-json-v1',migratedAt:new Date()}},
                {upsert:true}
            );
        })().catch(error=>{
            migrationPromise=null;
            throw error;
        });
    }
    return migrationPromise;
};

module.exports=class Favourite{
    static async addToFavourite(homeId){
        const objectId=getObjectId(homeId);
        if(!objectId){
            return false;
        }
        await migrateLegacyFavourites();
        await getDb().collection('favourites').updateOne(
            {_id:objectId},
            {$setOnInsert:{homeId:objectId,createdAt:new Date()}},
            {upsert:true}
        );
        return true;
    }

    static async getFavourites(){
        await migrateLegacyFavourites();
        const favourites=await getDb().collection('favourites')
            .find({homeId:{$type:'objectId'}}, {projection:{homeId:1}})
            .toArray();
        return favourites.map(favourite=>favourite.homeId.toString());
    }

    static async removeFromFavourite(homeId){
        const objectId=getObjectId(homeId);
        if(!objectId){
            return false;
        }
        await migrateLegacyFavourites();
        const result=await getDb().collection('favourites').deleteOne({_id:objectId});
        return result.deletedCount>0;
    }
};
