const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const twoFA = require('../../models/2FA');
const logger = require('../logger');

module.exports.register2FA = async function(req , res){
try {
    logger.info(`Activated Register 2FA Endpoint`)
    //user input
    const email = req.body.email; // User identification
    logger.info(`Input - ${email}`)
    //check email provided or not
    if(!email){
        logger.error(`Email is required`)
        return res.status(400).json('Email is required')
    }
    const secret = speakeasy.generateSecret({ length: 20 }); // Generate a 20-character secret
    const isExist = await twoFA.findOne({email})
   //check if email is already registered
    if(isExist){
        return res.status(422).json(`Device Already Registered`)
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
        logger.error(`Failed to generate QR code`)
        return res.status(500).json({ message: 'Failed to generate QR code' });
      }
      logger.info(`Output - Secret - ${secret.base32} ImageURL - ${imageUrl}`)
      return res.status(200).json({ secret: secret.base32, imageUrl });
    });
} catch (error) {
    logger.error(`Register 2FA Endpoint Failed`)
    return res.status(500).json(`Something went wrong while registering 2FA`)
}
}