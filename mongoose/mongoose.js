const mongoose = require('mongoose');
require('dotenv').config();
const URL = process.env.URL;
// mongoose.connect(URL);

// const db = mongoose.connection;

// db.once('error',function(err){
//     console.log("Error connecting to MongoDB: ",err);
// });

// db.once('open',function(){
//     console.log("Successfully connected to Atlas MongoDB");
// })

// module.exports = db;

const connectToMongoDB = async () => {
    try {
      await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Successfully connected to Atlas MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:');
    }
  };
  
  connectToMongoDB();