const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const AdminUser = require('../../models/AdminUser');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
module.exports.adminConsole = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.ADMIN_CONSOLE_ACTIVATED);
    //user input
    var token = req.body.token || req.query.token || req.headers["x-access-token"];
    //check for valid response
    if(!token){
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    var userRole;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
         // Decrypt
         var bytes  = CryptoJS.AES.decrypt(token, secret);
         token = bytes.toString(CryptoJS.enc.Utf8);
        const decode = jwt.verify(token , secret);
        
    //check for user role as per token
         userRole = decode.role;
         var id =decode.id
    } catch (error) {
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
        //check Admin user is active or not
    try {
        var activeUser = await AdminUser.findById(id) 
         if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    } catch (error) {
        logger.error(errorMessages.SOMETHING_WENT_WRONG)
        return res.status(502).json(errorMessages.SOMETHING_WENT_WRONG)
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
            logger.info(`End`);
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

