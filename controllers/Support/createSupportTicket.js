const SupportTicket = require('../../models/SupportTicket');
const TicketHistory =  require('../../models/TicketHistory');
const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.createSupportTicket = async function(req , res){
try {
    logger.info(successMessages.CREATE_SUPPORT_TICKET_ACTIVATED);
    logger.info(successMessages.START);
    var {userId ,issue ,description ,category ,priority} = req.body;
    
    if(!userId || !issue || !description || !category || !priority){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED);
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    try {
        const userData = await User.findById({_id:userId});
        if(!userData){
            logger.error(errorMessages.NOT_FOUND);
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
        
        const data =  await SupportTicket.countDocuments();
        let formattedNumber;
        counter = data + 1;
        if (counter < 10) {
            formattedNumber = counter.toString().padStart(7, '0');
        } else if (counter < 100) {
            formattedNumber = counter.toString().padStart(7, '0');
        }else if (counter < 1000) {
            formattedNumber = counter.toString().padStart(7, '0');
        }else if (counter < 10000) {
            formattedNumber = counter.toString().padStart(7, '0');
        }else if (counter < 100000) {
            formattedNumber = counter.toString().padStart(7, '0');
        }else if (counter < 1000000) {
            formattedNumber = counter.toString().padStart(7, '0');
        }
         else {
            formattedNumber = counter.toString();
            
        }

        const ticketId = 'INC'+ formattedNumber;
        const userName = userData.firstName + ' ' + userData.lastName;
        const contact = userData.contact;
        const email = userData.email;
        const ticketStatus = 'Opened';

        const enquiryData = await SupportTicket.create({
             ticketId ,userName, contact , email ,  issue, description , category, priority 
        })
        const ticketData = await TicketHistory.create({
            contact , ticketId ,status:ticketStatus
        })
        logger.info(`Ticket History Created - ${ticketData}`);
        logger.info(successMessages.TICKET_CREATED_SUCCESSFULLY)
        logger.info(successMessages.END);
        return res.status(200).json(successMessages.TICKET_CREATED_SUCCESSFULLY);
    } catch (error) {
        logger.error(error);
        return res.json(error);
    }

} catch (error) {
    logger.error(errorMessages.CREATE_TICKET_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
    

}