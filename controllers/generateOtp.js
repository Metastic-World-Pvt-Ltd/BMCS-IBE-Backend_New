const User = require('../models/User');
require('dotenv').config();

module.exports.generateOtp = async function(req, res){
try {
    //user input
    const {contact} = req.body;

    if(!contact){
        res.status(400).json('contact is Mandatory')
    }
    //check contact exist or not
    // const contactExist = await User.findOne({contact:contact});
    
    // if(contactExist){
        //generate OTP
        const otpInt = Math.floor(1000 + Math.random() *9000);
        const otp = otpInt.toString();
        console.log(otp);
        
        //set otp expiry time
        const expiration= Date.now() + 120000;
        
        module.exports.expiration = expiration;
        module.exports.otp = otp;

        //sent otp to mobile
        const accountSid = process.env.accountSid;
        const authToken = process.env.authToken;
        const client = require('twilio')(accountSid, authToken);
        
        client.messages
            .create({
                body: `Enter the ${otp} to verify you Please do not share the OTP  `,
                from: '+12292672362',
                to: contact,
            })
            //.then(message => console.log(message.sid))
            .catch((error) => {
                console.log(error);
              });

            res.status(200).json('OTP has been sent successfully');    

    // }else{
    //     res.status(403).json('contact is already registered')
    // }
} catch (error) {
    res.status(400).json('Error  in Generating OTP')
}

}