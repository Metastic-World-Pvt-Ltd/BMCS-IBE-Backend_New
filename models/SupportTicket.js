 const mongoose =  require('mongoose');

const commentSchema = new mongoose.Schema({
    commentBy: {
        type: String, // or ObjectId, depending on your user schema
        required: true,
      },
      commentValue: {
        type: String,
        required: true,
      },
      userRole: {
        type: String,
        required: true,
      },
});

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
    comments:[commentSchema]
    ,
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