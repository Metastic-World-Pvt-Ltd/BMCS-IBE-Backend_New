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
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    priority:{
        type:String,
        required:true,
    },
    assignedTo:{
        type:String,
    },
    prevAssignee:{
        type:[String],

    },
    comments:{
        type:String,
        
    },
    status:{
        type:String,
        required:true,
    },
    closedBy:{
        type:String,
    
    },

},{
    timestamps:true
})

module.exports = mongoose.model('SupportTicket', supportData);