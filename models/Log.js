const mongoose =  require('mongoose');

const logData =  new mongoose.Schema({
    level:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true
    },
    meta:{
        type:String,
        required:true,
    },


},{
    timestamps:true
})

module.exports = mongoose.model('Log', logData);