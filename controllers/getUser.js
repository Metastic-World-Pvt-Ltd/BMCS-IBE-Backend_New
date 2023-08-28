const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require("./logger");

module.exports.getUser = async function(req, res){
 try {
    logger.info(`Activated Get User Endpoint `);
    //user input
    const empId = req.params.empId || req.body.empId || req.query.empId || req.headers["empId"];
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Token - ${token}`)
    //check for token provided or not
    if(!token){
        return res.status(401).json('Please Provide Token');
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
            logger.error(`Please provide employee ID`)
            return res. status(400).json(`Please provide employee ID`)
        }
        //search empId in db
        const userData = await User.findOne({empId});
        //check record found or not
        if(userData == null){
            logger.error(`No Record Found`);
            return res.status(404).json(`No Record Found`);
        }
        logger.info(`Output - ${userData}`)
        //return response
        return res.status(200).json(userData)
    }else{
        logger.error(`Anauthorized Access`);
        return res.status(403).json(`Anauthorized Access`);
    }


} catch (error) {
    //if Endpoint failed
    logger.error(`Get User Endpoint Failed`);
    return res.status(500).json(`Something went wrong in get user`)
}
    
}