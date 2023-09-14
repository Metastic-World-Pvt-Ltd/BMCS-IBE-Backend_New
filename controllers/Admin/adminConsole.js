const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const AdminUser = require('../../models/AdminUser');
const logger = require('../User/logger');
const errorMessages = require('../errorMessages');
const successMessages = require('../successMessages');
module.exports.adminConsole = async function(req, res){
try {
    logger.info(successMessages.ADMIN_CONSOLE_ACTIVATED);
    //user input
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    //check for valid response
    if(!token){
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
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
        //check Admin user is active or not
        const activeUser = await AdminUser.findById({_id}) 
        if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    logger.info(`User Role - ${userRole}`)
    //condition to check role specific rights
    if(userRole == "Admin" || userRole == "admin"){
        //check for project in DB
        const projectData = await Project.find()
        if(projectData.length == 0){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }else{
            //response
            logger.info(`Output - ${projectData}`)
            return res.status(200).json(projectData)
        }
    }else{
        logger.error(errorMessages.ACCESS_DENIED);
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
} catch (error) {
    logger.error(errorMessages.ADMIN_CONSOLE_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}

