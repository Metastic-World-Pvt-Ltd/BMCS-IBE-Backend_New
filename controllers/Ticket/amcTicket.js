const AMC = require('../../models/AMC');
const User = require('../../models/User');
const TicketHistory =  require('../../models/TicketHistory');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.amcTicket = async function(req , res){
try {
    logger.info(successMessages.AMC_TICKET_ACTIVATED);
    logger.info(successMessages.START);
    var {userId , projectName , projectDiscription , netWorth , companySize, companyType , refBy} = req.body;
    
    if(!userId || !projectName || !netWorth || !companySize || !companyType || !refBy){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED);
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const isExist = await AMC.findOne({projectName});
    
    if(isExist){
        logger.error(errorMessages.PROJECT_NAME_EXIST);
        return res.status(422).json(errorMessages.PROJECT_NAME_EXIST)
    }
    try {
        const userData = await User.findById({_id:userId});
        if(!userData){
            logger.error(errorMessages.NOT_FOUND);
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
        
        const data =  await AMC.countDocuments();
        let formattedNumber;
        counter = data + 1;
        if (counter < 10) {
            formattedNumber = counter.toString().padStart(4, '0');
        } else if (counter < 100) {
            formattedNumber = counter.toString().padStart(4, '0');
        }else if (counter < 1000) {
            formattedNumber = counter.toString().padStart(4, '0');
        }
         else {
            formattedNumber = counter.toString();
            
        }

        const ticketId = 'A-RITM'+ formattedNumber;
        const userName = userData.firstName + ' ' + userData.lastName;
        const contact = userData.contact;
        const email = userData.email;
        const projectStatus = 'Opened';
        if(!projectDiscription){
            projectDiscription = '';
        }
        const enquiryData = await AMC.create({
            userId , ticketId ,userName, contact , email ,  projectName  , netWorth , companySize  , companyType, projectDiscription, projectStatus , refBy
        })
        const ticketData = await TicketHistory.create({
            contact , ticketId ,status:projectStatus
        })
        logger.info(`Ticket History Created - ${ticketData}`);
        logger.info(successMessages.QUERY_CREATED)
        logger.info(successMessages.END);
        return res.status(200).json(successMessages.QUERY_CREATED);
    } catch (error) {
        logger.error(error);
        return res.json(error);
    }

} catch (error) {
    logger.error(errorMessages.AMC_TICKET_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
    

}