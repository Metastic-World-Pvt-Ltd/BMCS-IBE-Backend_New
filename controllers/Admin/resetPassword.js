const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const bcrypt = require('bcryptjs');
const logger = require('../User/logger');
module.exports.resetPassword = async function(req, res){
try {
    logger.info(`Activated Reset Password Endpoint`)
    //input token from iser
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Input - ${req.body}`)
    //input email and password
    const {email, password} = req.body;
    //check for token provided or not
    if(!token){
        return res.status(403).json('Please Provide Token');
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
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        //check for email and password provided or not
        if(!email || !password){
            logger.error(`Email & New Password both required`)
            return res.status(400).json("Email & New Password both required")
        }else{
            //generate salt to create hash
            var salt = bcrypt.genSaltSync(20);
            //encypt thepassword
            var hashPassword = bcrypt.hashSync(password, salt);
            //check the email and update the password in DB
            const userData = await AdminUser.findOneAndUpdate({email},{password:hashPassword},{new:true})
            //console.log(userData);
            //check for record found or not in DB
            if(userData == null){
                logger.error(`No Record Found`)
                return res.status(404).json("NO Record Found")
            }else{
                logger.info(`Password has been reset`)
                //response
                return res.status(200).json("Password has been reset")
            }
        }

    }else{
        logger.error(`Anauthorized Access`)
        return res.status(403).json(`Anauthorized Access`)
    }
} catch (error) {
    logger.error(`Reset Password Endpoint Failed`)
    return res.status(500).json("Something went wrong in Password Reset")
}
}