const AdminUser = require('../../models/AdminUser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const bcrypt = require('bcryptjs');
const logger = require("../logger");
module.exports.resetPassword = async function(req, res){
try {
    logger.info(`Activated Reset Password Endpoint`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    logger.info(`Input - ${req.body}`)
    const {email, password} = req.body;
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    
    const secret = process.env.SECRET_KEY;
    const decode = jwt.verify(token , secret);
    
    const userRole = decode.role;
    logger.info(`User Role - ${userRole}`)
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        if(!email || !password){
            logger.error(`Email & New Password both required`)
            return res.status(400).json("Email & New Password both required")
        }else{
            var salt = bcrypt.genSaltSync(20);
            var hashPassword = bcrypt.hashSync(password, salt);
            
            const userData = await AdminUser.findOneAndUpdate({email},{password:hashPassword},{new:true})
            console.log(userData);
            if(userData == null){
                logger.error(`No Record Found`)
                return res.status(404).json("NO Record Found")
            }else{
                logger.info(`Password has been reset`)
                return res.status(200).json("Password has been reset")
            }
        }

    }else{
        logger.error(`Anauthorized Access`)
        return res.status(401).json(`Anauthorized Access`)
    }
} catch (error) {
    logger.error(`Reset Password Endpoint Failed`)
    return res.status(500).json("Something went wrong in Password Reset")
}
}