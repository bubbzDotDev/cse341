const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const username = process.env.MONGO_USER_NAME;
const password = process.env.MONGO_PASSWORD;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(`mongodb+srv://${username}:${password}@cluster0.1agtp.mongodb.net/shop?retryWrites=true&w=majority`)
  .then(client => {
    console.log('Connected');
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;