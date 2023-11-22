const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const AdminUser = require('../../models/AdminUser');

module.exports.closeTicket = async function(req , res){
    const ticketId = req.params.ticket || req.body.ticket || req.query.ticket || req.headers["ticket"];
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    const {comment} =  req.body;
    console.log(comment);
    console.log(ticketId);
    if(!ticketId || !_id){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    if(!comment){
        return res.status(400).json(errorMessages.COMMENT_REQUIRED)
    }
    const ticketData = await SupportTicket.findOne({ticketId});
    const userData = await AdminUser.findById({_id});
    const status = 'Closed';
    const closedBy = userData.name;
    const newComment = {
        commentBy: userData.name, 
        commentValue: comment
      };
    if(ticketData.status == 'In Progress'){       
        const updateStatus = await SupportTicket.findOneAndUpdate({ticketId},{
            status,
            closedBy,
            $push: { comments: newComment } 
        },{new:true});
        return res.json(updateStatus);
    }else{
        return res.status(400).json(errorMessages.ACCESS_DENIED);
    }

}