const User = require('../../models/User');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
require('dotenv').config({path:'../../.env'});


module.exports.getUser = async function(req, res){
 try {
    logger.info(`Start`);
    logger.info(successMessages.GET_USER_ACTIVATED);
    //user input
    const empId = req.params.empId || req.body.empId || req.query.empId || req.headers["empId"];

        logger.info(`Input - ${empId}`);
        //check for empID is provided or not
        if(!empId){
            logger.error(errorMessages.EMPID_REQUIRED)
            return res. status(400).json(errorMessages.EMPID_REQUIRED)
        }
        //search empId in db
        const userData = await User.findOne({empId});
        //check record found or not
        if(userData == null){
            logger.error(errorMessages.NOT_FOUND);
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
        logger.info(`Output - ${userData}`)
        logger.info(`End`);
        //return response
        return res.status(200).json(userData)



} catch (error) {
    //if Endpoint failed
    logger.error(errorMessages.GET_USER_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}