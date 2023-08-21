const nodemailer = require("nodemailer");
require('dotenv').config({path:'../.env'});

module.exports.generateEmailOtp = async function(req, res){
    try {
    //user email address
    var useremail = req.body.email;
      

    const data = Math.floor(Math.random() * 9000) + 1000;
    var otp = data.toString();
    //set otp expiry time
    const expiration= Date.now() + 120000;
        
    module.exports.expiration = expiration;
   // console.log(otp)
    module.exports.otp = otp;

    let testAccount = await nodemailer.createTestAccount();

    //sender email
    var senderEmail = process.env.EMAIL;
    //sender email password
    var userPassword = process.env.EMAIL_PASSWORD;

    let transporter = nodemailer.createTransport({
        host: "s26.wpx.net",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: senderEmail,
            pass: userPassword
        },
      })
      
try {
    let info = await transporter.sendMail({
        from: `no-reply@bmcsindia.in <${senderEmail}>`, // sender address
        to: useremail, // list of receivers
        subject: "OTP Verification", // Subject line
        text: `Enter the ${otp} to verify you Please do not share the OTP `, // plain text body
        html: `Enter the <b>${otp}</b> to verify you Please do not share the OTP `, // html body
      });
      //console.log(info);
     // console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
     // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.send("OTP has been send to your email")
} catch (error) {
    res.json(error);
}
    } catch (error) {
        res.status(500).json(`smething went wrong generating otp via email  ${error}`)
    }
}