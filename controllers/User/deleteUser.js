const AdminUser = require('../../models/AdminUser');
const User =  require(`../../models/User`);
require('dotenv').config({path:'../../.env'});
const jwt = require('jsonwebtoken');
const DeletedUser =  require(`../../models/DeletedUser`);
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

module.exports.deleteUser = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.DELETE_USER_ACTIVATED)
    const {email} = req.body;
    logger.info(`email - ${email}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Token - ${token } `)
    //check for token provided or not
    if(!token){
        logger.error(errorMessages.TOKEN_NOT_FOUND)
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    if(!email){
        logger.error(errorMessages.EMAIL_REQUIRED)
        return res.status(400).json(errorMessages.EMAIL_REQUIRED)
    }
    // //secret ket to decode token
    // const secret = process.env.SECRET_KEY;
    // const decode = jwt.verify(token , secret);
    var userRole;
    var _id;
    var adminEmail;
    try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
        const decode = jwt.verify(token , secret);
        console.log(decode);
         _id = decode.id;
         adminEmail = decode.email;
    //check for user role as per token
         userRole = decode.role;
    } catch (error) {
        return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    }
    //user role decoded from token signature    
    //const userRole = decode.role;

    const activeUser = await AdminUser.findById({_id})
    
    if(activeUser == null){
        logger.error(`In active Admin`)
        return res.status(401).json(errorMessages.ACCESS_DENIED)
    }
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        const isExist = await User.findOne({email});
        logger.info(`User In DB - ${isExist}`)
        if(isExist == null){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
        try {
            const deleteData = await User.findOneAndDelete({email});
            const DeletedHist = await DeletedUser.create({
                name:isExist.firstName +''+ isExist.lastName,
                email:isExist.email,
                contact:isExist.contact,
                empId:isExist.empId,
                role:isExist.userRole,
                refBy:isExist.refBy,
                deletedBy:adminEmail,
            })
            logger.info(successMessages.CREATED_USER_HISTORY);
            logger.error(errorMessages.USER_DELETED_SUCCESSFULLY+ " " + deleteData)
            logger.info(`End`);
            return res.status(200).json(errorMessages.USER_DELETED_SUCCESSFULLY)
        } catch (error) {
            logger.error(`Error -${error}`)
            return res.json(errorMessages.SOMETHING_WENT_WRONG)
        }

    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }

} catch (error) {
    logger.error(errorMessages.DELETE_USER_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}