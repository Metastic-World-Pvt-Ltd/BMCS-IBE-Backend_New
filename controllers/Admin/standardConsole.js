const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require("../logger");
const AdminUser = require('../../models/AdminUser');
module.exports.standardConsole = async function(req, res){
try {
    logger.info(`Activated Standard Console Endpoint`)
    //input token from user
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Token - ${token}`)
    //check for token provided or not
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    //secret key to decode token
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    //user role decoded from token signature
    const userRole = decode.role;
    //check Admin user is active or not
    const activeUser = await AdminUser.findById({_id}) 
    if(activeUser == null){
        logger.error(`In active Admin`)
        return res.status(401).json(`Access Denied`)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Standard" || userRole == "standard"){
        //project status
        const projectStatus = "Inprogress";
        //check for prorject status in DB
        const projectData = await Project.find({projectStatus})
        //check record found or not in DB
        if(projectData.length == 0){
            logger.error(`NO Projects Available`)
            return res.status(404).json("NO Projects Available")
        }else{
            logger.info(`Output - ${projectData}`)
            //response
            return res.status(200).json(projectData)
        }
        
    }else{
        logger.error(`Anauthorized Access`)
        return res.status(403).json(`Anauthorized Access`)
    }
} catch (error) {
    logger.error(`Standard Console Endpoint Failed`)
    return res.status(500).json("Something went wrong in Standard Console")
}
    
}

