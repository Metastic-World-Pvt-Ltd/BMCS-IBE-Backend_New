const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require("../logger");
module.exports.superAdminConsole = async function(req, res){
try {
    logger.info(`Activated Super Admin Console Endpoint`)
    //input token from user
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
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        //find the data in DB
        const projectData = await Project.find()
        //check record found in DB or not
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
    logger.error(`Super Admin Console Endpoint Failed`)
    return res.status(500).json("Something went wrong in Super Admin Console")
}
    
}

