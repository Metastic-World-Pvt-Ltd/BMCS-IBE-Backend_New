const AdminUser = require('../../models/AdminUser');
const logger = require('../logger');
require('dotenv').config({path:'../../.env'});
const jwt = require('jsonwebtoken');
const DeletedUser =  require(`../../models/DeletedUser`);

module.exports.deleteAdmin = async function(req, res){
try {
    logger.info(`Activated Delete Admin Endpoint`)
    const {email} = req.body;
    logger.info(`email - ${email}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Token - ${token } `)
    //check for token provided or not
    if(!token){
        logger.error(`Please Provide Token`)
        return res.status(401).json('Please Provide Token');
    }
    if(!email){
        logger.error(`Please provide email id`)
        return res.status(400).json(`Please provide email id`)
    }
    //secret ket to decode token
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    //user role decoded from token signature    
    const userRole = decode.role;
    const _id = decode.id;
    const adminEmail = decode.email;
    const activeUser = await AdminUser.findById({_id})
    
    if(activeUser == null){
        logger.error(`In active Admin`)
        return res.status(401).json(`Access Denied`)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        const isExist = await AdminUser.findOne({email});
        logger.info(`User In DB - ${isExist}`)
        if(isExist == null){
            logger.error(`NO Record Found`)
            return res.status(404).json(`No Record Found`)
        }
        try {
            const deleteData = await AdminUser.findOneAndDelete({email});
            const DeletedHist = await DeletedUser.create({
                name:isExist.name,
                email:isExist.email,
                role:isExist.role,
                deletedBy:adminEmail,
            })
            logger.info(`Created USer Delete History`);
            logger.error(`User Deleted SuccessFully -  ${deleteData}`)
            return res.status(200).json(`User Deleted SuccessFully`)
        } catch (error) {
            logger.error(`Error -${error}`)
            return res.json(`Somthing went wrong`)
        }

    }else{
        logger.error(`Access Denied`)
        return res.status(403).json(`Access Denied`)
    }

} catch (error) {
    logger.error(`Delete Admin User Endpoint Failed`);
    return res.status(500).json(`Something went wrong in deleting user`)
}

}