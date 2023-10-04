const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const AdminUser = require('../../models/AdminUser');

module.exports.assignToMe = async function(req , res){
    const ticketId = req.params.ticket || req.body.ticket || req.query.ticket || req.headers["ticket"];
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    console.log(ticketId);
    if(!ticketId || !_id){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const ticketData = await SupportTicket.findOne({ticketId});
    const userData = await AdminUser.findById({_id});
    console.log(userData);
    const status = 'In Progress';
    const assignedTo = userData.name;
    if(ticketData.assignedTo == 'empty'){
       
        const updateStatus = await SupportTicket.findOneAndUpdate({ticketId},{status,assignedTo},{new:true});
        return res.json(updateStatus);
    }else{       
        var prevAssignee = [];
        //console.log(ticketData.prevAssignee);
        for(let i=0;i<ticketData.prevAssignee.length;i++){
            prevAssignee.push(ticketData.prevAssignee[i]);
        }
        // prevAssignee.push(ticketData.prevAssignee)
        prevAssignee.push(ticketData.assignedTo);
        //console.log(prevAssignee);
        const updateStatus = await SupportTicket.findOneAndUpdate({ticketId},{status,assignedTo,prevAssignee},{new:true});
        return res.json(updateStatus);
        
    }
}