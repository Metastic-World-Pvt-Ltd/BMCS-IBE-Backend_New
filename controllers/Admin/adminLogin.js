const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
module.exports.adminLogin = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.ADMIN_LOGIN_ACTIVATED)
    const {email , password} = req.body;
    logger.info(`Input - ${email}`)
    logger.info(`Input - ${password}`)
    const secret = process.env.SECRET_KEY;
    
    const userLogin = await AdminUser.findOne({email: email});
     // console.log(userLogin);

    if(!userLogin){
        // console.log('Invalid username or password');
        logger.error(errorMessages.INVALID_USER_PASSWORD)
        return res.status(400).json({message:errorMessages.INVALID_USER_PASSWORD})
    }else{
        // console.log(password);
        const isMatch = bcrypt.compareSync(password, userLogin.password); ;
        if(!isMatch){
            // console.log('Invalid username or password');
            logger.error(errorMessages.INVALID_USER_PASSWORD)
            return res.status(401).json({message:errorMessages.INVALID_USER_PASSWORD})
        }else{
            //generate token with signature using email, userId , user role 
            jwt.sign({email,id:userLogin._id,role:userLogin.role},secret , {algorithm: 'HS512', expiresIn: '24h' } , (err,token)=>{
                if(err) {
                    logger.error(`Error - ${err}`)
                    throw new err;
                }
                //response
                logger.info(successMessages.ADMIN_LOGIN_SUCCESS)
                //function to encypt Token                        
                const newToken =  encToken(token);                        
                logger.info(`End`);
                                        
                return res.status(200).cookie('token',newToken).json({
                    id:userLogin._id,
                    name:userLogin.name,
                    role:userLogin.role,
                    "2FA":userLogin.set2FA,
                    newToken,
                    
                })
            })
        }
    }
} catch (error) {
    logger.error(errorMessages.ADMIN_LOGIN_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}

try {
    function encToken(token){
        const secret = process.env.SECRET_KEY;
        var token =  CryptoJS.AES.encrypt(token, secret).toString();
        console.log(token);
        return token;
    }
} catch (error) {
    return error;
}