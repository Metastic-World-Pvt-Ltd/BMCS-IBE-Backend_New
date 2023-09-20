const speakeasy = require('speakeasy');
const twoFA = require('../../models/2FA');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.verify2FA = async function(req, res){
try {
    logger.info(successMessages.VERIFY_2FA_ACTIVATED)
    const email = req.body.email; // User identification
    logger.info(`Input - ${email}`)
    const user = await twoFA.findOne({email}) 
    logger.info(`User in DB - ${user}`)
    if (!user) {
      return res.status(400).json({ message: errorMessages.NOT_FOUND });
    }
  
    const otpCode = req.body.otpCode; // OTP code entered by the user
    if(!otpCode){
        logger.error(errorMessages.OTP_CODE_REQUIRED)
        return res.status(400).json(errorMessages.OTP_CODE_REQUIRED)
    }
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: otpCode,
      window: 0, // Allow codes that are 1 step behind or ahead
    });
  
    if (verified) {
        logger.info(successMessages.OTP_VERIFICATION_SUCCESSFULL)
      return res.status(200).json({ message: successMessages.OTP_VERIFICATION_SUCCESSFULL });
    } else {
        logger.error(errorMessages.OTP_VERIFICATION_FAILED)
        return res.status(400).json({ message: errorMessages.OTP_VERIFICATION_FAILED });
    }
} catch (error) {
    logger.error(errorMessages.VERIFY_OTP_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}