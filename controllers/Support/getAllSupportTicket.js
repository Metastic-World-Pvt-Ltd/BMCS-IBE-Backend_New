const SupportTicket = require('../../models/SupportTicket');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.getAllSupportTicket = async function(req , res){
    try {
        logger.info(successMessages.GET_ALL_SUPPORT_TICKET);
        logger.info(successMessages.START);

        const page = parseInt(req.query.page) || 1;
        const limit = 8;

        const count = await SupportTicket.countDocuments();

        const data = await SupportTicket.find()
        .skip((page -1)* limit)
        .limit(limit)

        logger.info(`Output - ${data}`)
        logger.info(successMessages.END)
        if(data.length != 0){
            return res.status(200).json({
                page,
                totalPages: Math.ceil(count / limit),
                'Tickets':data
            });
        }else{
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
    } catch (error) {
        logger.error(errorMessages.GET_ALL_SUPPORT_TICKET_FAILED);
        return res.json(error);
    }
    
}