const History = require('../models/History');
const Wallet = require('../models/Wallet');
const Kyc = require('../models/Kyc');
const nodemailer = require("nodemailer");
const logger = require('./logger');

require('dotenv').config({path:'../.env'});

module.exports.withdrawAmt = async function(req, res){
try {
    
    logger.info(`Activated Withdraw Amount Endpoint`)
    const {contact} = req.body;
    logger.info(`Input - ${contact}`)
    if(!contact){
        logger.error(`contact is required`)
        return res.status(400).json("contact is required")
    } 
    const checkWallet = await Wallet.findOne({contact:contact});
    logger.info(`Output - ${checkWallet}`)
    const minAmt = 2000;
    if(checkWallet.totalEarning > minAmt){
        const kycData = await Kyc.findOne({contact:contact})
        logger.info(`Output - ${kycData}`)
        if(kycData){
            const userName = kycData.name
            const userEmail = kycData.email;
            const userAccount = kycData.accountNumber;
            const userIFSCCode = kycData.ifscCode;
            const amount = checkWallet.totalEarning;

            // let testAccount = await nodemailer.createTestAccount();

            // //sender email
            // var senderEmail = process.env.EMAIL;
            // //sender email password
            // var userPassword = process.env.EMAIL_PASSWORD;

            // let transporter = nodemailer.createTransport({
            //     host: "s26.wpx.net",
            //     port: 465,
            //     secure: true, // true for 465, false for other ports
            //     auth: {
            //         user: senderEmail,
            //         pass: userPassword
            //     },
            // })
      
            // try {
            //     let info = await transporter.sendMail({
            //         from: `no-reply@bmcsindia.in <${senderEmail}>`, // sender address
            //         to: userEmail, // list of receivers
            //         subject: "Withdraw Request", // Subject line
            //         text: `Name - ${userName}
            //                Email - ${userEmail}
            //                Account NUmber - ${userAccount}
            //                IFSC Code - ${userIFSCCode}
            //                Amount - ${amount}   `, // plain text body

            //         html: `Name - <b>${userName}</b>
            //                 Email - <b>${userEmail}</b>
            //                 Account NUmber - <b>${userAccount}</b>
            //                 IFSC Code - <b>${userIFSCCode}</b>
            //                 Amount - <b>${amount}</b>   `, // html body
            //     });
            //     logger.info(`Email info - ${info}`)
            //     console.log(info);
            //     //console.log("Message sent: %s", info.messageId);
              
            //     logger.info(`Deatils has been send`)
            //     // res.status(200).json("Deatils has been send")
            // } catch (error) {
            //     logger.error(`Error - ${error}`)
            //     res.json(error);
            // }
            const data = {
                totalEarning:0,
                projectEarning:[
                    {      
                    withdrawableAmount:0,
                    }
                ],
                referralEarning:0
                
            }
            const udpateAmt = await Wallet.findOneAndUpdate({contact},data,{new:true})
            logger.info(`Output - ${udpateAmt}`)

            const hist = await History.create({
                contact,
                transactionAmount:amount,
                type:'Debit',
                status:'Pending',
                origin:'withdraw',
            }) 
            logger.info(`Output - ${hist}`)
            res.status(200).json(hist)
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