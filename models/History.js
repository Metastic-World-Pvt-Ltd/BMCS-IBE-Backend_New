const mongoose =  require('mongoose');

const historyData =  new mongoose.Schema({
    contact:{
        type:String,
        required:true
    },
    projectName:{
        type:String,
        required:true
    },
    transactionAmount:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    status:{
        type:String,
    },
    origin:{
        type:String,
        required:true,
    },
    transactionId:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('History', historyData);