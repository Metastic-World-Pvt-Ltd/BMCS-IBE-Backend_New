const History = require('../models/History');
const Wallet = require('../models/Wallet');
const Kyc = require('../models/Kyc');
const nodemailer = require("nodemailer");
const logger = require('./logger');

require('dotenv').config({path:'../.env'});

module.exports.withdrawAmt = async function(req, res){
try {
    
    logger.info(`Activated Withdraw Amount Endpoint`)
    //user input
    const {contact} = req.body;
    logger.info(`Input - ${contact}`)
    //valid inout or not
    if(!contact){
        logger.error(`contact is required`)
        return res.status(400).json("contact is required")
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
              
                logger.info(`Email has been send `)
                // res.status(200).json("Deatils has been send")
            } catch (error) {
                logger.error(`Error - ${error}`)
                return res.status(550).json("550 No Such User Here");
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
                origin:'withdraw',
                transactionId,

            }) 
            logger.info(`Output - ${hist}`)
            //response
            return res.status(200).json(hist)
        }else{
            logger.error(`No Record Found`)
            return res.status(404).json("No record Found")
        }
    }else{
        logger.error(`Minimum withdraw Amount is 2000`)
        return res.status(401).json('Minimum withdraw Amount is 2000')
    }
} catch (error) {
    logger.error(`Withdraw Amount Endpint Failed`)
    return res.status(500).json(`Something went wrong in withdraw amount`)
}
    
}