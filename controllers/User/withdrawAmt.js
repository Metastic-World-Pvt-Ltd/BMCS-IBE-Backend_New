const History = require('../../models/History');
const Wallet = require('../../models/Wallet');
const Kyc = require('../../models/Kyc');
const nodemailer = require("nodemailer");
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

require('dotenv').config({path:'../.env'});

module.exports.withdrawAmt = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.WITHDRAW_AMOUNT_ACTIVATED)
    //user input
    const {contact} = req.body;
    logger.info(`Input - ${contact}`)
    //valid inout or not
    if(!contact){
        logger.error(errorMessages.CONTACT_IS_REQUIRED)
        return res.status(400).json(errorMessages.CONTACT_IS_REQUIRED)
    } 
    //check for user wallet exist or not 
    const checkWallet = await Wallet.findOne({contact:contact});
    logger.info(`Output - ${checkWallet}`)
    //minimum amount as per client
    const minAmt = 2000;
    //check wallet amount is less than or not
    if(checkWallet.totalEarning > minAmt){
        //check kyc data in DB
        const kycData = await Kyc.findOne({contact:contact})
        logger.info(`Output - ${kycData}`)
        if(kycData){
            //defined required details 
            const userName = kycData.name
            const userEmail = kycData.email;
            const userContact = kycData.contact
            const userId = kycData.empId;
            const userAccount = kycData.accountNumber;
            const userIFSCCode = kycData.ifscCode;
            const amount = checkWallet.totalEarning;
            
            let testAccount = await nodemailer.createTestAccount();

            //sender email
            var senderEmail = process.env.EMAIL;
            //sender email password
            var userPassword = process.env.EMAIL_PASSWORD;

            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
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
                    to: senderEmail, // list of receivers
                    subject: "Withdraw Request", // Subject line
                    text: `Withdraw Request received, below are the details 

                           Name - ${userName}
                           Email - ${userEmail}
                           Contact - ${userContact}
                           Employee Id - ${userId}
                           Account Number - ${userAccount}
                           IFSC Code - ${userIFSCCode}
                           Amount - ${amount}   `, // plain text body

                    html: ` <br>
                            Hi Team, <br> <br>
                            Withdraw Request received, below are the details <br> <br>
                            Name - <b>${userName}</b> <br>
                            Email - <b>${userEmail}</b> <br>
                            Contact - <b>${userContact}</b>  <br>
                            Employee Id - <b>${userId}</b> <br>
                            Account Number - <b>${userAccount}</b> <br>
                            IFSC Code - <b>${userIFSCCode}</b> <br>
                            Amount - <b>${amount}</b>
                            <br><br><br><br>
                            Thanks <br>
                            Team Admin   `, // html body
                });
                logger.info(`Email info - ${info.response , info.envelope , info.accepted , info.rejected, info.messageId}`)
                //console.log(info);
                //console.log("Message sent: %s", info.messageId);
              
                logger.info(successMessages.EMAIL_SENT_TO_FINANACE)
                logger.info(`End`);
                //return res.status(200).json(successMessages.EMAIL_SENT_TO_FINANACE)
            } catch (error) {
                logger.error(`Error - ${error}`)
                return res.status(550).json(errorMessages.EMAIL_SENT_ERROR);
            }
            //update wallet amount
            const data = {
                totalEarning:0,
                projectEarning:[
                    {      
                    withdrawableAmount:0,
                    }
                ],
                referralEarning:0
                
            }
            //update details in DB
            const udpateAmt = await Wallet.findOneAndUpdate({contact},data,{new:true})
            logger.info(`Output - ${udpateAmt}`)
            //generate history for the transaction
            const transactionId = 'WIT' + Date.now(); 
            const hist = await History.create({
                contact,
                transactionAmount:amount,
                type:'Debit',
                status:'Pending',
                origin:'Withdraw',
                transactionId,

            }) 
            logger.info(`Output - ${hist}`)
            //response
            logger.info(`End`)
            return res.status(200).json(hist)
        }else{
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND)
        }
    }else{
        logger.error(errorMessages.MINMUM_AMOUNT_ERROR)
        return res.status(403).json(errorMessages.MINMUM_AMOUNT_ERROR)
    }
} catch (error) {
    logger.error(errorMessages.WITHDRAW_AMOUNT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
    
}