const jwt = require('jsonwebtoken');
const logger = require('../controllers/User/logger');
require('dotenv').config({path:'../.env'});

module.exports.verifyUser = async function(req, res, next){

// try {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        logger.error(`Token is required for authentication`)
        return res.status(400).send("Token is required for authentication");
      }

    const secret = process.env.SECRET_KEY;
    try {
        const data = jwt.verify(token , secret)
        req.user = data;
        module.exports.data = data;
               
    } catch (error) {
        if(error.message == "jwt expired"){
            logger.error(`Token expired`)
            return res.status(401).json('Token Expired')
        }else if(error.message == "invalid token"){
            logger.error(`Invalid token`)
            return res.status(401).json('Invalid token')
        }else{
            logger.error(`Error -${error}`)
            return res.status(401).json(error)
        }
        
    }
    return next();
// } catch (error) {
//     logger.error(`Verify user middleware Failed`)
//     return res.status(500).json('Something went wrong in user verification')
// }

    
}
