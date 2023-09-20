const Project = require('../../models/ClientProduct');
const History = require('../../models/History');
const Wallet = require('../../models/Wallet');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.projectApproval = async function(req, res){
try {
    logger.info(successMessages.PROJECT_APPROVAL_ACTIVATED)
    //input project ID
    const _id =  req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Id - ${_id}`)
    logger.info(`Input - ${req.body}`)
    //input for sactioned amount
    const {sanctionedAmount , projectStatus} = req.body;
    //check projects exist or not in DB
    const projectData = await Project.findById({_id});
    //console.log(projectData);
    //check for record in DB
    if(projectData == null){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
    }
    //check for project status to approve
    if(projectData.projectStatus == "Completed" || projectData.projectStatus == "Rejected" || projectData.projectStatus == "Approved"){
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED);
    }
    //check project status provided or not
    if(!projectStatus){
        logger.error(errorMessages.PROJECT_STATUS_REQUIRED)
        return res.status(400).json(errorMessages.PROJECT_STATUS_REQUIRED);
    }else{
        //check for project status and authorzie it 
        if(projectStatus == "Approved"){
            //check for sacntioned amount is provided or not
            if(!sanctionedAmount){
                logger.error(errorMessages.SANCTIONED_AMOUNT_REQUIRED)
                return res.status(400).json(errorMessages.SANCTIONED_AMOUNT_REQUIRED);
            }
            //update the data in DB
            const approvedData = await Project.findByIdAndUpdate({_id},{projectStatus,sanctionedAmount},{new:true})
                        // console.log(transactionAmount);
                        //required fields for DB
                        const type = 'credit';
                        const origin = 'projectEarning';
                        const contact = projectData.contact
                       //create history
                       const transactionId = 'PRO' + Date.now();
                        const userHistory = await History.create({
                            contact,
                            transactionAmount:sanctionedAmount,
                            type,
                            status:'Pending',
                            origin,
                            transactionId,
                        })  
                        logger.info(`Output - ${userHistory}`)
                       //console.log(userHistory);
                      //update user wallet amount 
                      //find user data in Wallet
                     const amountData = await Wallet.findOne({contact});
                     console.log(amountData);
                     if(amountData == null){
                        const data = await Wallet.create({
                            contact,
                            projectEarning:[
                              {
                                pendingAmount:sanctionedAmount,
                                withdrawableAmount:0,
                            }
                            ],
                            referralEarning:0,
                            totalEarning:0
                            
                       })
                     }else{
                    //get prev pendig amount and current amount add it
                      const amount =  amountData.projectEarning[0].pendingAmount + sanctionedAmount; 
                      //update the data into DB
                      const data = await Wallet.findOneAndUpdate({contact},{
                          projectEarning:[
                            {pendingAmount:amount}
                          ]
                     })
                     logger.info(`Output - ${data}`)
                     //console.log(data.projectEarning);
                     }

                     //response
            return res.status(200).json(approvedData);
        }else if(projectStatus == "Rejected"){
            const rejectedData = await Project.findByIdAndUpdate({_id},{projectStatus},{new:true})
            return res.status(200).json(rejectedData);
        }else{
            logger.error(`Unable to perform action as status is ${projectData.projectStatus}`)
            return res.status(401).json(`Unable to perform action as status is ${projectData.projectStatus}`);
        }
    }
} catch (error) {
    logger.error(errorMessages.PROJECT_APPROVAL_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}