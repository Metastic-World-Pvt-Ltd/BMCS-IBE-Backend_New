const mongoose =  require('mongoose');

const historyData =  new mongoose.Schema({
    contact:{
        type:String,
        required:true
    },
    transactionAmount:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    origin:{
        type:String,
        required:true,
    },
},{
    timestamps:true
})

module.exports = mongoose.model('History', historyData);