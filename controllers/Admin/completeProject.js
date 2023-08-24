const Project = require('../../models/Project');
const History = require('../../models/History');
const Wallet = require('../../models/Wallet');
const logger = require("../logger");
module.exports.completeProject = async function(req , res){
try {
    logger.info(`Activated Complete Project Endpoint`)
    const _id =  req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Id - ${_id}`)
    const {projectStatus} = req.body;
    logger.info(`Input - ${req.body}`)
    if(!_id){
        logger.error(`Project Id is required`)
        return res.status(400).json("Project Id is required")
    }
    if(!projectStatus){
        logger.error(`Project Status is required`)
        return res.status(400).json("Project Status is required")
    }
 
    if(projectStatus == "Completed" || projectStatus == "completed"){
        const projectData = await Project.findById({_id});
        //console.log(projectData);
        if(projectData ==  null){
            logger.error(`No Records Found`)
            return res.status(404).json("No Records Found");
        }
        if(projectData.projectStatus == "Approved" || projectData.projectStatus == "approved"){
            const completeData = await Project.findByIdAndUpdate({_id},{projectStatus},{new:true})
            const contact = projectData.contact;
            //console.log(completeData);
            const withdrawableAmount = parseInt(projectData.sanctionedAmount);

            const lessAMount = await Wallet.findOne({contact});

            const amount = parseInt(lessAMount.projectEarning[0].pendingAmount) - withdrawableAmount; 

            const totalAmount = parseInt(lessAMount.totalEarning) + withdrawableAmount;

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
            const type = 'credit';
            const origin = 'projectEarning';
            const status = 'completed'
            const userHistory = await History.create({
                contact,
                transactionAmount:withdrawableAmount,
                type,
                status,
                origin,
            }) 
            logger.info(`Output - ${userHistory}`)
            //console.log("hist",userHistory);
            
        }else{
            logger.error(`Unable to perform action as status ${projectData.projectStatus}`)
            return res.status(401).json(`Unable to perform action as status ${projectData.projectStatus}`)
        }
        return res.send("ok");
    }else{
        logger.error(`Unable to perform action`)
        return res.status(401).json(`Unable to perform action`)
    }
} catch (error) {
    logger.error(`Complete Project Endpoint Failed`)
    return res.status(500).json("Something went wrong in Project Complete")
}

}

