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
    projectDiscription:{
        type:String,
    },
    projectAmount:{
        type:Number,
        required:true,
    },
    projectStatus:{
        type:String,
        required:true,
    },
    refBy:{
        type:String,
    },

},{
    timestamps:true
})

module.exports = mongoose.model('Enquiry', enquiryData);