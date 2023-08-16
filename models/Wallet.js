const mongoose =  require('mongoose');

const walletData =  new mongoose.Schema({
    contact:{
        type:String,
        required:true
    },
    projectEarning:{
        type:String,
        required:true,
    },
    referralEarning:{
        type:String,
        required:true,
    },
    totalEarning:{
        type:String,
        required:true,
    },
},{
    timestamps:true
})

module.exports = mongoose.model('Wallet', walletData);