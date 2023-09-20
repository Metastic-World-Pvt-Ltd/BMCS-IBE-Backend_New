const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const twoFA = require('../../models/2FA');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

module.exports.register2FA = async function(req , res){
try {
    logger.info(successMessages.REGISTER_2FA_ACTIVATED)
    //user input
    const email = req.body.email; // User identification
    logger.info(`Input - ${email}`)
    //check email provided or not
    if(!email){
        logger.error(errorMessages.EMAIL_REQUIRED)
        return res.status(400).json(errorMessages.EMAIL_REQUIRED)
    }
    const secret = speakeasy.generateSecret({ length: 20 }); // Generate a 20-character secret
    const isExist = await twoFA.findOne({email})
   //check if email is already registered
    if(isExist){
        return res.status(422).json(errorMessages.DEVICE_ALREADY_REGISTERED)
    }
    //store data into DB
    const user = await twoFA.create({
        email,
        secret:secret.base32
    })
  
    // Generate a QR code URL for Google Authenticator
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `${email}`,
      issuer: 'BMCS INDIA',
    });
  //generate QR Code
    qrcode.toDataURL(otpAuthUrl, (err, imageUrl) => {
      if (err) {
        logger.error(errorMessages.QR_GENERATE_FAILED)
        return res.status(500).json({ message: errorMessages.QR_GENERATE_FAILED });
      }
      logger.info(`Output - Secret - ${secret.base32} ImageURL - ${imageUrl}`)
      return res.status(200).json({ imageUrl });
    });
} catch (error) {
    logger.error(errorMessages.REGISTER_2FA_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}