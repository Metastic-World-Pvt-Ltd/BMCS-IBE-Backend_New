const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('./logger');
require('dotenv').config();
module.exports.userSignin =  async function(req, res){
try {
    logger.info(`Activated User Sign IN Endpoint`)
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
        logger.error(`user does not exist`)
        res.status(404).json('user does not exist')
    }
} catch (error) {
    logger.error(`User Sign In Endpoint Failed`)
    res.status(500).json('Something went wrong in Signin')
}
}