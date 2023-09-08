const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const AdminUser = require('../../models/AdminUser');
const logger = require('../User/logger');
module.exports.adminConsole = async function(req, res){
try {
    logger.info(`Activated Admin Console Endpoint`)
    //user input
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    //check for valid response
    if(!token){
        return res.status(401).json('Please Provide Token');
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
        return res.status(401).json(`Token Expired`)
    }
        //check Admin user is active or not
        const activeUser = await AdminUser.findById({_id}) 
        if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(`Access Denied`)
        }
    logger.info(`User Role - ${userRole}`)
    //condition to check role specific rights
    if(userRole == "Admin" || userRole == "admin"){
        //check for project in DB
        const projectData = await Project.find()
        if(projectData.length == 0){
            logger.error(`NO Projects Available"`)
            return res.status(404).json("NO Projects Available")
        }else{
            //response
            logger.info(`Output - ${projectData}`)
            return res.status(200).json(projectData)
        }
    }else{
        logger.error(`Anauthorized Access`)
        return res.status(401).json(`Anauthorized Access`)
    }
} catch (error) {
    logger.error(`Admin Console Endpoint Failed`)
    return res.status(500).json("Something went wrong in Admin Console")
}
    
}

