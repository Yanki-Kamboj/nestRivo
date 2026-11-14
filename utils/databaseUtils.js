const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const MONGO_URL = process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || 'nestrivo';

let _db;
const mongoConnect = (callback) => {
    MongoClient.connect(MONGO_URL).then(client => {
        console.log('MongoDB Connected successfully');
        _db = client.db(DB_NAME);
        callback(client);
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    }); 
};

const getDb = () => {
    if (!_db) {
        throw new Error('Database not initialized. Call mongoConnect first.');
    }
    return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;