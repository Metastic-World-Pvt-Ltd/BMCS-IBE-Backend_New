const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
require('dotenv').config({path:'../../.env'});
module.exports.userSignin =  async function(req, res){
try {
    logger.info(successMessages.USER_SIGN_IN_ACTIVATED)
    const {contact} = req.body;
    logger.info(`Input - ${req.body}`)
    const userDoc = await User.findOne({contact:contact});
    if(userDoc){
       //generate token for user
       logger.info(`User found in DB`)
       const firstName = userDoc.firstName;
       const secret = process.env.SECRET_KEY;
        jwt.sign({contact,firstName} , secret , { algorithm: 'HS512' } , (err,token)=>{
          if(err) throw new err;
            logger.info(`Token - ${token} UserDoc - ${userDoc}`)
            res.status(200).json({token , userDoc})
           })
       // res.status(200).json('user verified')
    }else{
        logger.error(errorMessages.USER_DOES_NOT_EXIST)
        res.status(404).json(errorMessages.USER_DOES_NOT_EXIST)
    }
} catch (error) {
    logger.error(errorMessages.USER_SIGN_IN_FAILED)
    res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}