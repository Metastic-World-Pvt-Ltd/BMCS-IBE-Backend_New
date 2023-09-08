const speakeasy = require('speakeasy');
const twoFA = require('../../models/2FA');
const logger = require('../User/logger');
module.exports.verify2FA = async function(req, res){
try {
    logger.info(`Activated Verify 2FA Endoint`)
    const email = req.body.email; // User identification
    logger.info(`Input - ${email}`)
    const user = await twoFA.findOne({email}) 
    logger.info(`User in DB - ${user}`)
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    const otpCode = req.body.otpCode; // OTP code entered by the user
    if(!otpCode){
        logger.error(`OTP CODE is Rquired`)
        return res.status(400).json(`OTP CODE is Rquired`)
    }
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: otpCode,
      window: 0, // Allow codes that are 1 step behind or ahead
    });
  
    if (verified) {
        logger.info(`OTP verification successful'`)
      return res.status(200).json({ message: 'OTP verification successful' });
    } else {
        logger.error(`OTP verification failed`)
        return res.status(400).json({ message: 'OTP verification failed' });
    }
} catch (error) {
    logger.error(`Verify 2FA Endpoint Failed`);
    return res.status(500).json(`Something went wrong in verify 2FA`)
}
}