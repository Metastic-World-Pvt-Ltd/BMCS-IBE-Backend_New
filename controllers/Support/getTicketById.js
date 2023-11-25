const Support = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');

module.exports.getTicketById = async function(req , res){
    const id = req.headers['id'];

    if(!id){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }

    const data = await Support.findOne({ticketId:id});

    if(data){
        return res.status(200).json(data)
    }else{
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
}