const mongoose =  require('mongoose');

const walletData =  new mongoose.Schema({
    contact:{
        type:String,
        required:true
    },
    projectEarning:{
        pendingAmount:{
            type:Number,
        }, 
        withdrawableAmount:{
            type:Number,
            required:true,
        }, 
    },
    referralEarning:{
        type:Number,        
    },
    totalEarning:{
        type:Number,
        required:true,
    },
},{
    timestamps:true
})

module.exports = mongoose.model('Wallet', walletData);