const Project = require('../../models/Project');
const History = require('../../models/History');
const Wallet = require('../../models/Wallet');
const Ticket = require('../../models/Ticket');
const TicketHistory = require('../../models/TicketHistory');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.completeProject = async function(req , res){
try {
    logger.info(`Start`);
    logger.info(successMessages.COMPLETE_PROJECT_ACTIVATED)

    //input of status from body
    const {productId ,projectStatus} = req.body;
    logger.info(`Input -${productId}, ${projectStatus}`)
    //check if ID provided or not
    if(!productId){
        logger.error(errorMessages.PROJECT_ID)
        return res.status(400).json(errorMessages.PROJECT_ID)
    }
    //check for project status provided or not
    if(!projectStatus){
        logger.error(errorMessages.PROJECT_STATUS)
        return res.status(400).json(errorMessages.PROJECT_STATUS)
    }
    //check for project status by admin
    if(projectStatus == "Completed" || projectStatus == "completed"){
        //check projec exist in DB or not
        const projectData = await Project.findOne({projectId});
        //console.log(projectData);
        //if no record found
        if(projectData ==  null){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
        //console.log(projectData.projectStatus);
        
        //check if Data in DB status is approved or not
        if(projectData.projectStatus == "Approved" || projectData.projectStatus == "approved"){
            //find and update data in DB
            const completeData = await Project.findOneAndUpdate({projectId},{projectStatus},{new:true})
            // console.log(completeData.contact);
            const contact = projectData.contact;
            //console.log(completeData);
            //withdraw amount
            const withdrawableAmount = parseInt(projectData.sanctionedAmount);
            //get detials fro wallert for the user
            const lessAMount = await Wallet.findOne({contact});
            //less the pending amount
            const amount = parseInt(lessAMount.projectEarning[0].pendingAmount) - withdrawableAmount; 
            //add pending amount in total amount and withdrawable amount
            const totalAmount = parseInt(lessAMount.totalEarning) + withdrawableAmount;
            //check and update amount in DB
            const pendingAmount = await Wallet.findOneAndUpdate({contact},{
                projectEarning:[
                    {
                    pendingAmount:amount,
                    withdrawableAmount:withdrawableAmount,
                    }
                ],
                totalEarning:totalAmount,
            },{new:true})
            logger.info(`Output - ${pendingAmount}`)
            //console.log("pending amount ",pendingAmount);
            //define all required data field
            const type = 'credit';
            const origin = 'Project';
            const status = 'Completed'
            //generate history for user transaction
            const transactionId = 'PRO' + Date.now();
            const userHistory = await History.create({
                contact,
                transactionAmount:withdrawableAmount,
                type,
                status,
                origin,
                transactionId,
            }) 
            logger.info(`Output - ${userHistory}`)
            //console.log("hist",userHistory);
            const projectData2 = await Project.findOneAndUpdate({projectId},{projectStatus},{new:true})
            logger.info(`Output - ${successMessages.STATUS_HAS_UPDATED_SUCCESSFULLY}`)
            //update Ticket status
            const newStatus = 'Closed';
            const ticketData = await Ticket.findOneAndUpdate({contact},{projectStatus:newStatus},{new:true})
            logger.info(`Updated Status -${successMessages.STATUS_HAS_UPDATED_SUCCESSFULLY}`);
            const ticketId = ticketData.ticketId;
            const tktHistData =  await TicketHistory.findOneAndUpdate({ticketId},{status:newStatus},{new:true});
            logger.info(`Ticket History Generated - ${successMessages.STATUS_HAS_UPDATED_SUCCESSFULLY}`);
            
        }else{
            logger.error(errorMessages.ACCESS_DENIED)
            return res.status(403).json(errorMessages.ACCESS_DENIED)
        }
        logger.info(successMessages.COMPLETE_PROJECT);
        logger.info(`End`);
        return res.status(200).json(successMessages.COMPLETE_PROJECT);
    }else{
        logger.error(errorMessages.UNABLE_TO_PERFORM)
        return res.status(401).json(errorMessages.UNABLE_TO_PERFORM)
    }
} catch (error) {
    logger.error(errorMessages.COMPLETE_PROJECT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}

}

