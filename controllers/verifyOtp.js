const OTP = require('./generateOtp');

module.exports.verifyOtp = async function(req, res){
    try {
        const {otp} = req.body;

       if(OTP.otp == otp){
            if(OTP.expiration > Date.now()){
                res.status(200).json('OTP Verified Successfully');
            }else{
                res.status(498).json('OTP has been expired');
            }       
       }else{
            res.status(404).json('Invalid OTP')
       }
    } catch (error) {
        console.log('something went wrong');
        res.status(404).json('Error',error);
    }

}