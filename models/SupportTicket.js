const mongoose =  require('mongoose');

const supportData =  new mongoose.Schema({
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
    issue:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    category:{
        type:String,
        required:true,
    },
    priority:{
        type:String,
        required:true,
    },

},{
    timestamps:true
})

module.exports = mongoose.model('SupportTicket', supportData);