const mongoose =  require('mongoose');

const kycData =  new mongoose.Schema({
    name:{
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


},{
    timestamps:true
})

module.exports = mongoose.model('Kyc', kycData);