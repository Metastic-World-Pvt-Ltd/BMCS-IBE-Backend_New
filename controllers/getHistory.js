const History = require('../models/History');
const logger = require('./logger');

module.exports.getHistory = async function(req, res){
try {
    logger.info(`Activated Get History Endpoint`)
    
    const id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`ID - ${id}`)
    const allData = await History.findOne({transactionId:id})
    //console.log(allData);
    if(allData){
        logger.info(`Output - ${allData}`)
        return res.status(200).json(allData)
    }else{
        logger.error(`No Record Found`)
        return res.status(404).json("No Record Found")
    }
} catch (error) {
    logger.error(`Get Hisotry Endpoint Failed`);
    return res.status(500).json(`Something went wrong in fetching history`)
 }
}