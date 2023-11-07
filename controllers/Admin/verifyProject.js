const Project = require('../../models/Project');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const Ticket = require('../../models/Ticket');
const TicketHistory = require('../../models/TicketHistory');
module.exports.verifyProject = async function(req, res){
try {
    logger.info(successMessages.VERIFY_PROJECT_ACTIVATED)
    
    //project status and comment
    const {projectId , projectStatus,comment} = req.body;
    logger.info(`Input - ${projectStatus} , ${comment}`)
    //console.log(_id, projectStatus);
    //check for project id and status
    if(!projectId || !projectStatus ){
        logger.error(errorMessages.PROJECT_ID_AND_STATUS_REQUIRED);
        return res.status(400).json(errorMessages.PROJECT_ID_AND_STATUS_REQUIRED);
    }
    const checkStatus = await Project.findOne({projectId})
    console.log(checkStatus);
    if(!checkStatus){
        logger.error(`Error - ${errorMessages.NOT_FOUND}`)
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
    if(checkStatus.projectStatus == "Verified"){
        logger.error(`Error - ${errorMessages.PROJECT_ALREADY_VERIFIED}`);
        return res.status(400).json(errorMessages.PROJECT_ALREADY_VERIFIED);
    }
    //check for status and update data as per status
    if(projectStatus == "Verified" || projectStatus == "verified"){
        //update data
        const projectData = await Project.findOneAndUpdate({projectId},{projectStatus},{new:true})
        logger.info(`Output - ${projectData}`)
        const contact = projectData.contact;
        const status = 'Work in Progress';
        const ticketData = await Ticket.findOneAndUpdate({contact},{projectStatus:status},{new:true})
        logger.info(`Updated Status - ${ticketData}`);
        const ticketId = ticketData.ticketId;

        const tktHistData =  await TicketHistory.findOneAndUpdate({ticketId},{status:status},{new:true});
        logger.info(`Ticket History Generated - ${tktHistData}`);
        //response
         res.status(200).json(projectData);
         //check status update comment data and return response
    }else if(projectStatus == "Re_Verify" || projectStatus == "re_verify"){
        //check if comment provided or not
        if(!comment){
            logger.error(errorMessages.COMMENT_REQUIRED)
            res.status(400).json(errorMessages.COMMENT_REQUIRED)
        }else{
            //updste the data into DB
            const projectData = await Project.findOneAndUpdate({projectId},{comment},{new:true})
            logger.info(`Output - ${projectData}`)
            const contact = projectData.contact;
            const status = 'Pending Document';
            const ticketData = await Ticket.findOneAndUpdate({contact},{projectStatus:status},{new:true})
            logger.info(`Updated Status - ${ticketData}`);
            const ticketId = ticketData.ticketId;

            const tktHistData =  await TicketHistory.findOneAndUpdate({ticketId},{status:status},{new:true});
            logger.info(`Ticket History Generated - ${tktHistData}`);
            //reponse
            res.status(200).json(projectData);
        }

    }else{
        logger.error(errorMessages.INVALID_INPUT);
        return res.status(400).json(errorMessages.INVALID_INPUT);
    }
} catch (error) {
    logger.error(errorMessages.VERIFY_PROJECT_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}

}