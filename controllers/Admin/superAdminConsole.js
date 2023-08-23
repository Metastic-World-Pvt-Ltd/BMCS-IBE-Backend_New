const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require("../logger");
module.exports.superAdminConsole = async function(req, res){
try {
    logger.info(`Activated Super Admin Console Endpoint`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Token - ${token}`)
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    
    const userRole = decode.role;
    logger.info(`User Role - ${userRole}`)
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        const projectData = await Project.find()
        if(projectData.length == 0){
            logger.error(`NO Projects Available`)
            return res.status(404).json("NO Projects Available")
        }else{
            logger.info(`Output - ${projectData}`)
            return res.status(200).json(projectData)
        }
    }else{
        logger.error(`Anauthorized Access`)
        return res.status(401).json(`Anauthorized Access`)
    }
} catch (error) {
    logger.error(`Super Admin Console Endpoint Failed`)
    return res.status(500).json("Something went wrong in Super Admin Console")
}
    
}

