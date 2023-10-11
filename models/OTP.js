const mongoose =  require('mongoose');

const otpData =  new mongoose.Schema({
    contact:{
        type:String,
    },
    email:{
        type:String,
    },
    otp:{
        type:String,
        required:true,
    },
    expiration:{
        type:String,
        required:true,
    }


},{
    timestamps:true
})

module.exports = mongoose.model('OTP', otpData);