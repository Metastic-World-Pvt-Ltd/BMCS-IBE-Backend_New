const mongoose =  require('mongoose');

const kycData =  new mongoose.Schema({
    accHolderName:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    empId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    bankName:{
        type:String,
        required:true,
    },
    accountNumber:{
        type:String,
        required:true,
    },
    ifscCode:{
        type:String,
        required:true,
    },
    kycDocuments:{
        type:[String],
        required:true,
    },
    comment:{
        type:String,
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

module.exports = mongoose.model('Kyc', kycData);