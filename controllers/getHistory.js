const History = require('../models/History');
const logger = require('./logger');

module.exports.getHistory = async function(req, res){
    logger.info(`Activated Get History Endpoint`)
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`ID - ${_id}`)
    const allData = await History.findById({_id})
    //console.log(allData);
    if(allData){
        logger.info(`Output - ${allData}`)
        return res.status(200).json(allData)
    }else{
        logger.error(`No Record Found`)
        return res.status(404).json("No Record Found")
    }
}