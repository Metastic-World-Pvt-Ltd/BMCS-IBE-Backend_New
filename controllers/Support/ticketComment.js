const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const AdminUser = require('../../models/AdminUser');
const User = require('../../models/User');
const successMessages = require('../../response/successMessages');

module.exports.ticketComment = async function(req, res){
    const ticketId = req.params.ticket || req.body.ticket || req.query.ticket || req.headers["ticket"];
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    const {comment} = req.body;
    if(!ticketId || !_id || !comment){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const supportTicket = await SupportTicket.findOne({ticketId});
    console.log("SupportTicket",supportTicket);
    console.log("SupportTicket.comments",supportTicket.comments);
     var updateComment = [];
    // const commentData = supportTicket.comments
    // const commnetLength =  commentData.length;
    // console.log("commnetLength",commnetLength);
    // if(commnetLength == 0){
    //     updateComment = []
    // }else{
    //     updateComment.push(supportTicket.comments);
    // }


    
    // console.log(updateComment);
    if(!supportTicket){
        return res.status(404).json(errorMessages.NOT_FOUND);
    }

    if(supportTicket.status == "closed"){
        return res.status(403).json(errorMessages.ACCESS_DENIED);
    }
    const adminData = await AdminUser.findById({_id});
   
    const userData = await User.findById({_id});

    if(adminData){
        const newComment = {
            commentBy: adminData.name, 
            commentValue: comment
          };
        //updateComment.push({ commentBy: adminData.name, commentValue: comment})
        const ticketData = await SupportTicket.findOneAndUpdate({ticketId},{
             $push: { comments: newComment } 
        },{new:true})
    }else{
        const newComment = {
            commentBy: userData.firstName + userData.lastName, 
            commentValue: comment
          };
        //updateComment.push({ commentBy: userData.firstName + userData.lastName, commentValue: comment} )
        const ticketData = await SupportTicket.findOneAndUpdate({ticketId},{
            $push: { comments: newComment } 
        },{new:true});
    }

    return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY)

}