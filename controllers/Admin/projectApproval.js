const Project = require('../../models/Project');
const History = require('../../models/History');
const Wallet = require('../../models/Wallet');
const logger = require("../logger");
module.exports.projectApproval = async function(req, res){
try {
    logger.info(`Activated Project Approval`)
    const _id =  req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Id - ${_id}`)
    logger.info(`Input - ${req.body}`)
    const {sanctionedAmount , projectStatus} = req.body;
    const projectData = await Project.findById({_id});
    //console.log(projectData);
    if(projectData == null){
        logger.error(`NO Records Found`)
        return res.status(404).json("NO Records Found")
    }
    if(projectData.projectStatus == "Completed" || projectData.projectStatus == "Rejected" || projectData.projectStatus == "Approved"){
        logger,error(`Unable to perform action as status is ${projectData.projectStatus}`)
        return res.status(401).json(`Unable to perform action as status is ${projectData.projectStatus}`);
    }
    if(!projectStatus){
        logger.error(`Project Status is required`)
        return res.status(400).json("Project Status is required");
    }else{
        if(projectStatus == "Approved"){
            if(!sanctionedAmount){
                logger.error(`Sanctioned Amount is required`)
                return res.status(400).json("Sanctioned Amount is required");
            }
            const approvedData = await Project.findByIdAndUpdate({_id},{projectStatus,sanctionedAmount},{new:true})
                        // console.log(transactionAmount);
                        const type = 'credit';
                        const origin = 'projectEarning';
                        const contact = projectData.contact
                       
                        const userHistory = await History.create({
                            contact,
                            transactionAmount:sanctionedAmount,
                            type,
                            origin,
                        })  
                        logger.info(`Output - ${userHistory}`)
                       //console.log(userHistory);
                      //update user wallet amount 
                     const amountData = await Wallet.findOne({contact});
                     //console.log(amountData);
                      const amount =  amountData.projectEarning[0].pendingAmount + sanctionedAmount; 
                      const data = await Wallet.findOneAndUpdate({contact},{
                          projectEarning:[
                            {pendingAmount:amount}
                          ]
                     })
                     logger.info(`Output - ${data}`)
                     //console.log(data.projectEarning);
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
    logger.error(`Project Approval Endoint Failed`)
    return res.status(500).json("Something went wrong in Project Approval")
}
    
}