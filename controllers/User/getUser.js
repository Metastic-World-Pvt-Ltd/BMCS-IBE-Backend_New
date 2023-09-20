const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
require('dotenv').config({path:'../../.env'});


module.exports.getUser = async function(req, res){
 try {
    logger.info(successMessages.GET_USER_ACTIVATED);
    //user input
    const empId = req.params.empId || req.body.empId || req.query.empId || req.headers["empId"];
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Token - ${token}`)
    //check for token provided or not
    if(!token){
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    //secret ket to decode token
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    //user role decoded from token signature
    const userRole = decode.role;
    logger.info(`User Role - ${userRole}`)
    if(userRole == 'Standard' ||  userRole == 'Admin' || userRole == 'Super_Admin'){
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
        //return response
        return res.status(200).json(userData)
    }else{
        logger.error(errorMessages.ACCESS_DENIED);
        return res.status(403).json(errorMessages.ACCESS_DENIED);
    }


} catch (error) {
    //if Endpoint failed
    logger.error(errorMessages.GET_USER_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}