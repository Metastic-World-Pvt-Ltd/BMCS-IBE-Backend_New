const AdminUser = require('../../models/AdminUser');
const errorMessages = require('../../response/errorMessages');
const logger = require('../User/logger');

module.exports.getAdminUserFilter = async function(req, res){   
    try {
    
        logger.info(successMessages.START)
        logger.info(successMessages.GET_ALL_ADMIN_USER_FILTER)
        const role = req.body.role || req.query.role || req.headers["role"]
        if(!role){
            logger.error(errorMessages.ALL_FIELDS_REQUIRED)
            return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
        }
        var token = req.body.token || req.query.token || req.headers["x-access-token"];
        
        //check for token provided or not
        if(!token){
            logger.error(errorMessages.TOKEN_NOT_FOUND)
            return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
        }
    
        var userRole;
        var decode;
        try {
            //decode token signature
            const secret = process.env.SECRET_KEY;
             // Decrypt
             var bytes  = CryptoJS.AES.decrypt(token, secret);
             token = bytes.toString(CryptoJS.enc.Utf8);
             decode = jwt.verify(token , secret);
        //check for user role as per token
             userRole = decode.role;
    
        } catch (error) {
            logger.error(errorMessages.TOKEN_EXPIRED);
            return res.status(401).json(errorMessages.TOKEN_EXPIRED)
        }
        const _id = decode.id;
        var email = decode.email;
        const activeUser = await AdminUser.findById({_id})
        
        if(activeUser == null){
            logger.error(`In active Admin`)
            return res.status(401).json(errorMessages.ACCESS_DENIED)
        }
        logger.info(`User Role - ${userRole}`)
        //check for authorization
        if(userRole == "Super_Admin" || userRole == "super_admin"){
            const isExist = await AdminUser.findOne({email});
            console.log("isExist",isExist);
            logger.info(`User In DB - ${isExist}`)
            if(isExist == null){
                logger.error(errorMessages.NOT_FOUND)
                return res.status(404).json(errorMessages.NOT_FOUND)
            }
            try {
                const userData = await AdminUser.find({role},{password:0});
                if(userData){
                    logger.info(successMessages.END)
                    return res.status(200).json(userData)
                }
                else{
                    logger.error(errorMessages.NOT_FOUND)
                    return res.status(404).json(errorMessages.NOT_FOUND)
                }
                
            } catch (error) {
                logger.error(error)
                return res.status(502).json(errorMessages.BAD_GATEWAY)
            }
    
        }else{
            logger.error(errorMessages.ACCESS_DENIED)
            return res.status(403).json(errorMessages.ACCESS_DENIED)
        }
    } catch (error) {
        logger.error(errorMessages.GET_ALL_ADMIN_USER_FILTER_FAILED);
        return res.status(500).json(errorMessages.INTERNAL_ERROR);
    }
}