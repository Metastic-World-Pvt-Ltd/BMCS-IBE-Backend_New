const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const keySchema = new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    secretKey:{
        type: String,
        required:true
    },
},{
    timestamps:true
}
)


module.exports =mongoose.model('APIKEY', keySchema)