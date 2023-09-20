const Log = require('../../models/Log');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.getLogs = async function(req, res){
try {
    logger.info(successMessages.GET_LOGS_ACTIVATED);
    //check for token and start and end date to get logs
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const startdate = req.body.startdate || req.query.startdate || req.headers["startdate"];
    const enddate = req.body.enddate || req.query.enddate || req.headers["enddate"];
    logger.info(`Input - Start Date ${startdate} || End Date ${enddate}`)
    logger.info(`Token - ${token}`)
    //token provided or not
    if(!token){
        logger.error(errorMessages.TOKEN_NOT_FOUND)
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    var userRole;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
        const decode = jwt.verify(token , secret);
        console.log(decode);
    //check for user role as per token
         userRole = decode.role;
    } catch (error) {
        logger.error(errorMessages.TOKEN_EXPIRED)
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    logger.info(`User Role - ${userRole}`)
    //chck for user authoried or not
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        const fromDate = new Date(startdate) // Replace with  start date
            fromDate.setHours(0);
            fromDate.setMinutes(0);
            fromDate.setSeconds(0);
        const toDate = new Date(enddate);   // Replace with  end date
            toDate.setHours(23);
            toDate.setMinutes(59);
            toDate.setSeconds(59);
    
    
            // Define the date range filter
            const dateFilter = {
                timestamp: {
                  $gte: fromDate,
                  $lt: toDate,
                },
              };
    
        const data = await Log.find(dateFilter);
        //console.log(data);
        //check for record found or not
        if(data.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }else{
            logger.info(`Output - ${data}`)
            //response
            res.status(200).json(data);
        }
    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }


} catch (error) {
    logger.error(errorMessages.GET_LOGS_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}