const mongoose =  require('mongoose');

const kycData =  new mongoose.Schema({
    empId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    isIBE:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
    },
    videoURL:{
        type:String,
        required:true,
    },
    acceptedBy:{
        type:String,
    },
    closedBy:{
        type:String,
    },
    rejectedBy:{
        type:String,
    },

},{
    timestamps:true
})

module.exports = mongoose.model('VideoKYC', kycData);