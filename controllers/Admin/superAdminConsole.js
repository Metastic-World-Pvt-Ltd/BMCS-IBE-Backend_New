const Project = require('../../models/ClientProduct');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require('../User/logger');
const AdminUser = require('../../models/AdminUser');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.superAdminConsole = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.SUPER_ADMIN_CONSOLE_ACTIVATED)
    //input token from user
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    
    //check for token provided or not
    if(!token){
        logger.error(`Error - ${errorMessages.TOKEN_NOT_FOUND}`)
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    var decode;
    var userRole;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
         decode = jwt.verify(token , secret);
        console.log(decode);
    //check for user role as per token
         userRole = decode.role;
    } catch (error) {
        logger.error(`Error - ${errorMessages.TOKEN_EXPIRED}`)
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    const _id = decode.id;
    //check Admin user is active or not
    const activeUser = await AdminUser.findById({_id}) 
    if(activeUser == null){
        logger.error(`In active Admin`)
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        //find the data in DB
        const projectData = await Project.find()
        //check record found in DB or not
        if(projectData.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }else{
            logger.info(`Output - ${projectData}`)
            logger.info(`End`);
            //response
            return res.status(200).json(projectData)
        }
    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }
} catch (error) {
    logger.error(errorMessages.SUPER_ADMIN_CONSOLE_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}

