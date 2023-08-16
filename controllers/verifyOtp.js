const OTP = require('./generateOtp');
const emailOTP = require('./generateEmailOtp');

module.exports.verifyOtp = async function(req, res){
    try {
        const {otp} = req.body;
        //console.log('email otp',emailOTP.otp);
       if(OTP.otp == otp || emailOTP.otp == otp){
            if(OTP.expiration > Date.now() || emailOTP.expiration > Date.now()){
                res.status(200).json('OTP Verified Successfully');
            }else{
                res.status(498).json('OTP has been expired');
            }       
       }else{
            res.status(404).json('Invalid OTP')
       }
    } catch (error) {
        res.status(500).json('Something went wrong while OTP verification')
    }

}