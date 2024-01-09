const Project = require('../../models/Project');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const Ticket = require('../../models/Loan');
const TicketHistory = require('../../models/TicketHistory');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const AdminUser = require('../../models/AdminUser');
const webSocket = require('../../index');
module.exports.verifyProject = async function(req, res){
// try {
    logger.info(successMessages.VERIFY_PROJECT_ACTIVATED)
    
    //project status and comment
    const {projectId , projectStatus,comment} = req.body;
    logger.info(`Input - ${projectStatus} , ${comment}`)
    //console.log(_id, projectStatus);
                //user input
                var token = req.body.token || req.query.token || req.headers["x-access-token"];
                //check for valid response
                if(!token){
                    return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
                }
                var userRole;
                try {
                    //decode token signature
                    const secret = process.env.SECRET_KEY;
                     // Decrypt
                     var bytes  = CryptoJS.AES.decrypt(token, secret);
                     token = bytes.toString(CryptoJS.enc.Utf8);
                    const decode = jwt.verify(token , secret);
                    
                //check for user role as per token
                     userRole = decode.role;
                     var id =decode.id
                     var rejectedBy = decode.email;
                } catch (error) {
                    return res.status(401).json(errorMessages.TOKEN_EXPIRED)
                }
                    //check Admin user is active or not
                // try {
                    var activeUser = await AdminUser.findById({_id:id}) 
                     if(activeUser == null){
                        logger.error(`In active Admin`)
                        return res.status(401).json(errorMessages.ACCESS_DENIED)
                    }
                // } catch (error) {
                //     logger.error(errorMessages.SOMETHING_WENT_WRONG)
                //     return res.status(502).json(errorMessages.SOMETHING_WENT_WRONG)
                // }

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
       
        const socketData = webSocket.notifyStatusChange(projectId , projectStatus);
        console.log(socketData);
        
        const projectData = await Project.findOneAndUpdate({projectId},{projectStatus},{new:true})
        logger.info(`Output - ${projectData}`)
        const contact = projectData.contact;
        const isExistTicket = await Ticket.findOne({contact});
        if(isExistTicket){
            const status = 'In Progress';
            const ticketData = await Ticket.findOneAndUpdate({contact},{projectStatus:status},{new:true})
            logger.info(`Updated Status - ${ticketData}`);
            const ticketId = ticketData.ticketId;
    
            const tktHistData =  await TicketHistory.findOneAndUpdate({ticketId},{status:status},{new:true});
            logger.info(`Ticket History Generated - ${tktHistData}`);
            //response
             res.status(200).json(projectData);
        }else{
            return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY)
        }
        
         //check status update comment data and return response
    }else if(projectStatus == "Rejected" || projectStatus == "rejected"){
        //check if comment provided or not
        if(!comment){
            logger.error(errorMessages.COMMENT_REQUIRED)
            res.status(400).json(errorMessages.COMMENT_REQUIRED)
        }else{
            //updste the data into DB
            const projectData = await Project.findOneAndUpdate({projectId},{projectStatus ,comment , rejectedBy},{new:true})
            logger.info(`Output - ${projectData}`)
            const contact = projectData.contact;
            const isExistTicket = await Ticket.findOne({contact});
            if(isExistTicket){
                const status = 'Closed';
                const ticketData = await Ticket.findOneAndUpdate({contact},{projectStatus:status},{new:true})
                logger.info(`Updated Status - ${ticketData}`);
                const ticketId = ticketData.ticketId;
    
                const tktHistData =  await TicketHistory.findOneAndUpdate({ticketId},{status:status},{new:true});
                logger.info(`Ticket History Generated - ${tktHistData}`);
                //reponse
                res.status(200).json(projectData);
            }else{
                return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY)
            }

        }

    }else{
        logger.error(errorMessages.INVALID_INPUT);
        return res.status(400).json(errorMessages.INVALID_INPUT);
    }
// } catch (error) {
//     logger.error(errorMessages.VERIFY_PROJECT_FAILED);
//     return res.status(500).json(errorMessages.INTERNAL_ERROR);
// }

}