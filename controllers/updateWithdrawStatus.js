const History = require('../models/History');
const logger = require('./logger');
module.exports.updateWithdrawStatus = async function(req, res){
    logger.info(`Activated Update Withdraw Status Endpint`)
    //inout user ID
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`ID - ${_id}`)
    //check for ID available or not
    if(!_id){
        logger.error(`ID is required`)
        return res.status(400).json("ID is required")
    }
    //define the status
    const status = "completed";
    //update the status in DB
    const updateData = await History.findByIdAndUpdate({_id},{status:status},{new:true})
    if(updateData){
        logger.info(`Output - ${updateData}`)
        return res.status(200).json(updateData)
    }else{
        logger.error(`No Record Found`)
        return res.status(404).json("No record Found")
    }
    
}