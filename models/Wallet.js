const mongoose =  require('mongoose');

const projectEarningSchema = new mongoose.Schema({
    pendingAmount: Number,
    withdrawableAmount: Number,
  });

const walletData =  new mongoose.Schema({
    contact:{
        type:String,
        required:true
    },
    projectEarning:[
        projectEarningSchema
    ],
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