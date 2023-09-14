const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require('../User/logger');
const successMessages = require('../successMessages');
const errorMessages = require('../errorMessages');
module.exports.adminRegister = async function(req, res){
try {
    logger.info(successMessages.ADMIN_REGISTER_ACTIVATED)
    //input data
    if(!req.body){
        return res.status(400).json(errorMessages.INVALID_INPUT)
    }
    const {name , email , password, role}  = req.body;
    logger.info(`Input - ${name} , ${email} , ${password}, ${role}}`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    //check for token provided or not
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
    logger.info(`User Role - ${userRole}`)
    //check condition user specific role
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        createUser(name , email, password , role);
    }else if(userRole == "Admin" || userRole == "admin"){
        //admin can only create standard user
        if(role == "Standard" || role == "standard"){
            createUser(name , email, password , role);
        }else{
            logger.error(errorMessages.ACCESS_DENIED)
            return res.status(403).json(errorMessages.ACCESS_DENIED)
        }
    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }
    //define fucntion to create user
    async function createUser(name , email, password , role){
        if(!name || !email || !password || !role){
            //console.log('All fields are Mandatory');
            logger.error(errorMessages.INVALID_INPUT)
            return res.status(400).json({error:errorMessages.INVALID_INPUT})
        }
        //check for email or user exist
        const isExist = await AdminUser.findOne({email:email})
        if(isExist){
            logger.error(errorMessages.EMAIL_EXIST)
            return res.status(422).json({error:errorMessages.EMAIL_EXIST})
        }
        try {
         
            //create user in DB
            const userData = new  AdminUser({
                name , email , password , role
            })
            await userData.save();
            //console.log(userData);
            logger.info(`Output - ${userData}`)
            //response
            res.status(200).json({name:userData.name , email:userData.email});
        } catch (error) {
            logger.error(error)
            return res.json(error);   
        }
    }
} catch (error) {
    logger.error(errorMessages.ADMIN_REGISTER_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}

