const PIN = require('../../models/PIN');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');
const User = require('../../models/User');
require('dotenv').config({path:'../../.env'});
var CryptoJS = require("crypto-js");
module.exports.verifyPIN = async function(req , res){
try {
    logger.info(successMessages.VERIFY_PIN_ACTIVATED);
    logger.info(successMessages.START);
    //User Input
    const {contact , pin} = req.body;
    logger.info(`Input - ${contact} , ${pin}`)
    //check for required fields
    if(!contact || !pin){
        logger.error(`Error - ${errorMessages.ALL_FIELDS_REQUIRED}`)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    const checkUser =  await User.findOne({contact});
    if(checkUser){
        if(checkUser.userStatus == 'Inactive'){
            return res.status(401).json(errorMessages.INACTIVE_USER_ERROR)
        }
    }
    //check in DB data exist or not
    const isExist = await PIN.findOne({contact})
    console.log(isExist);
    if(isExist){

        //compare DB PIN and user entered PIN
        const isMatch = await bcrypt.compare(pin , isExist.PIN)
        //check PIN  matched or not
        if(isMatch){
            //response
            const userDoc = await User.findOne({contact});
            const secret = process.env.SECRET_KEY;
                jwt.sign({contact,id:userDoc._id } , secret , { algorithm: 'HS512', expiresIn: '90d' } , (err,token)=>{
                  if(err) throw new err;
                    logger.info(`UserDoc - ${userDoc}`)
                    logger.info(`End`);
                    var newToken =  encToken(token);
                   
                    return res.status(200).json({newToken , userDoc})
                   })
            // logger.info(`Output - ${successMessages.VERIFIED_PIN_SUCCESSFULLY}`)
            // return res.status(200).json(successMessages.VERIFIED_PIN_SUCCESSFULLY)
        }else{
            //error
            logger.error(`Error - ${errorMessages.ACCESS_DENIED}`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
    }else{
        //error
        logger.error(`Error - ${errorMessages.NOT_FOUND}`)
        return res.status(404).json(errorMessages.NOT_FOUND);
    }
} catch (error) {
    //error
    logger.error(`Error -  ${errorMessages.VERIFY_PIN_FAILED}`)
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}
}

function encToken(token){
    const secret = process.env.SECRET_KEY;
    var token =  CryptoJS.AES.encrypt(token, secret).toString();
    return token;
}