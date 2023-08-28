const OTP = require('./generateOtp');
const emailOTP = require('./generateEmailOtp');
const logger = require('./logger');

module.exports.verifyOtp = async function(req, res){
    try {
        logger.info('Activated Verify OTP Endpoint')
        //check for user input
        const {otp} = req.body;
        logger.info(`Input OTP - ${otp}`)
        //console.log('email otp',emailOTP.otp);
        //check for OTP is same of not
       if(OTP.otp == otp || emailOTP.otp == otp){
        //check for OTP expire time
            if(OTP.expiration > Date.now() || emailOTP.expiration > Date.now()){
                logger.info(`OTP Verified Successfully`);
                res.status(200).json('OTP Verified Successfully');
            }else{
                logger.error(`OTP has been expired`)
                res.status(498).json('OTP has been expired');
            }       
       }else{
            logger.error(`Invalid OTP`)
            res.status(404).json('Invalid OTP')
       }
    } catch (error) {
        logger.error(`Verify OTP Endpoint Failed`);
        res.status(500).json('Something went wrong while OTP verification')
    }

}