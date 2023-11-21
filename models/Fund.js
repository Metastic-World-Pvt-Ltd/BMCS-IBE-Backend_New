const mongoose =  require('mongoose');

const enquiryData =  new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    ticketId:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    projectName:{
        type:String,
        required:true
    },
    projectAmount:{
        type:Number,
        required:true,
    },
    netWorth:{
        type:Number,
        required:true,
    },
    companySize:{
        type:String,
        required:true,
    },
    companyType:{
        type:String,
        required:true,
    },
    serviceType:{
        type:String,
        required:true,
    },
    projectDiscription:{
        type:String,
    },
    projectStatus:{
        type:String,
        required:true,
    },
    refBy:{
        type:String,
    },
    acceptedBy:{
        type:String,
    },
    closedBy:{
        type:String,
    },
    comment:{
        type:String,
    },
},{
    timestamps:true
})

module.exports = mongoose.model('Fund', enquiryData);