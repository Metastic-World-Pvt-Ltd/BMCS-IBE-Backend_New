const Project = require('../../models/Project');
const History = require('../../models/History');
const Wallet = require('../../models/Wallet');
const Ticket = require('../../models/Loan');
const TicketHistory = require('../../models/TicketHistory');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const AdminUser = require('../../models/AdminUser');
const User = require('../../models/User');
const nodemailer = require("nodemailer");
const webSocket = require('../../index');
require('dotenv').config({path:'../../.env'});

module.exports.completeProject = async function(req , res){
try {
    logger.info(`Start`);
    logger.info(successMessages.COMPLETE_PROJECT_ACTIVATED)
        //user input
        var token = req.body.token || req.query.token || req.headers["x-access-token"];
        //check for valid response
        if(!token){
            return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
        }
        var userRole;
        try {
            //decode token signature
            const secret = process.env.SECRET_KEY;
             // Decrypt
             var bytes  = CryptoJS.AES.decrypt(token, secret);
             token = bytes.toString(CryptoJS.enc.Utf8);
            const decode = jwt.verify(token , secret);
            console.log("decode",decode);
        //check for user role as per token
             userRole = decode.role;
             var id =decode.id
             var closedBy = decode.email;
             
        } catch (error) {
            return res.status(401).json(errorMessages.TOKEN_EXPIRED)
        }
            //check Admin user is active or not
        try {
            var activeUser = await AdminUser.findById(id) 
             if(activeUser == null){
                logger.error(`In active Admin`)
                return res.status(401).json(errorMessages.ACCESS_DENIED)
            }
        } catch (error) {
            logger.error(errorMessages.BAD_GATEWAY)
            return res.status(502).json(errorMessages.BAD_GATEWAY)
        }

    //input of status from body
    const {projectId ,projectStatus} = req.body;
    logger.info(`Input -${projectId}, ${projectStatus}`)
    console.log(`${projectId}, ${projectStatus}`);
    //check if ID provided or not
    if(!projectId){
        logger.error(errorMessages.PROJECT_ID)
        return res.status(400).json(errorMessages.PROJECT_ID)
    }
    //check for project status provided or not
    if(!projectStatus){
        logger.error(errorMessages.PROJECT_STATUS)
        return res.status(400).json(errorMessages.PROJECT_STATUS)
    }
    //check for project status by admin
    if(projectStatus == "Completed" || projectStatus == "completed"){
        //check projec exist in DB or not
        const projectData = await Project.findOne({projectId});
        console.log(projectData);
        const ibeContact = projectData.contact;
        const projectName = projectData.projectName;
        const userData = await User.findOne({contact:ibeContact});
        const userEmail = userData.email;
        const userName = userData.fullName
        //if no record found
        if(projectData ==  null){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
        //console.log(projectData.projectStatus);
        
        //check if Data in DB status is approved or not
        if(projectData.projectStatus == "Approved" || projectData.projectStatus == "approved"){
            //find and update data in DB
            const completeData = await Project.findOneAndUpdate({projectId},{projectStatus,closedBy},{new:true})
            sendEmail(userEmail,userName , projectName)
            // console.log(completeData.contact);
            const contact = projectData.contact;
            //console.log(completeData);
            //withdraw amount
            const withdrawableAmount = parseInt(projectData.comissionAmount);
            //get detials fro wallert for the user
            const lessAMount = await Wallet.findOne({contact});

            console.log("lessAMount",lessAMount);
            //less the pending amount
            const amount = parseInt(lessAMount.projectEarning.pendingAmount) - withdrawableAmount; 
            //add pending amount in total amount and withdrawable amount
            const totalAmount = parseInt(lessAMount.totalEarning) + withdrawableAmount;
            //check and update amount in DB
            const pendingAmount = await Wallet.findOneAndUpdate({contact},{
                projectEarning:
                    {
                    pendingAmount:amount,
                    withdrawableAmount:withdrawableAmount,
                    }
                ,
                totalEarning:totalAmount,
            },{new:true})
            logger.info(`Output - ${pendingAmount}`)
            //console.log("pending amount ",pendingAmount);
            //define all required data field
            const type = 'credit';
            const origin = 'Project';
            const status = 'Completed'
            //generate history for user transaction
            const transactionId = 'PRO' + Date.now();
            const userHistory = await History.create({
                contact,
                transactionAmount:withdrawableAmount,
                type,
                status,
                origin,
                transactionId,
            }) 
            logger.info(`Output - ${userHistory}`)
            //console.log("hist",userHistory);
            //const projectData2 = await Project.findOneAndUpdate({projectId},{projectStatus},{new:true})
            logger.info(`Output - ${successMessages.STATUS_HAS_UPDATED_SUCCESSFULLY}`)
            //update Ticket status
            const socketData = webSocket.notifyStatusChange(projectId , projectStatus);
            console.log(socketData);

            const isExistTicket = await Ticket.findOne({contact});
            if(isExistTicket){
                const newStatus = 'Closed';
                const ticketData = await Ticket.findOneAndUpdate({contact},{projectStatus:newStatus},{new:true})
                logger.info(`Updated Status -${successMessages.STATUS_HAS_UPDATED_SUCCESSFULLY}`);
                const ticketId = ticketData.ticketId;
                const tktHistData =  await TicketHistory.findOneAndUpdate({ticketId},{status:newStatus},{new:true});
                logger.info(`Ticket History Generated - ${successMessages.STATUS_HAS_UPDATED_SUCCESSFULLY}`);
            }else{
                return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY)
            }

            
        }else{
            logger.error(errorMessages.ACCESS_DENIED)
            return res.status(403).json(errorMessages.ACCESS_DENIED)
        }
        logger.info(successMessages.COMPLETE_PROJECT);
        logger.info(`End`);
        return res.status(200).json(successMessages.COMPLETE_PROJECT);
    }else{
        logger.error(errorMessages.UNABLE_TO_PERFORM)
        return res.status(401).json(errorMessages.UNABLE_TO_PERFORM)
    }
} catch (error) {
    logger.error(errorMessages.COMPLETE_PROJECT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR);
}

}

async function sendEmail(useremail,name , projectName){
    let testAccount = await nodemailer.createTestAccount();

    //sender email
    var senderEmail = process.env.EMAIL;
    //sender email password
    var userPassword = process.env.EMAIL_PASSWORD;

    let transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: senderEmail,
            pass: userPassword
        },
    })

try {
    console.log("useremail",useremail);
    let info = await transporter.sendMail({
        from: `no-reply@bmcsindia.in <${senderEmail}>`, // sender address
        to: useremail, // list of receivers
        subject: `Successful Completion of ${projectName}. Celebrating Milestones Together!`, // Subject line
        text: `Dear ${name},

        Project completed Successfully!
        
        We trust this message finds you well. We are thrilled to share the fantastic news that the ${projectName} has reached its successful completion!
        It has been an exciting journey, and we are delighted with the results.
        
        Team Effort:We would like to express our gratitude for your collaboration throughout the project.
        Your insights and cooperation played a crucial role in achieving the outstanding results we celebrate today.
        
        Celebrating Success:We believe in celebrating success together. While we are immensely proud of what we've accomplished,
        we also want to acknowledge your role in making this project a triumph.
        
        Gratitude: Thank you for entrusting us with ${projectName}. It has been a pleasure working with you,
        and we look forward to any future collaborations.
        
        If you have any questions or require additional information, please do not hesitate to reach out.
        We value our partnership and appreciate the opportunity to contribute to your success.
        
        Best Regards,
        [Team BMCS]
        [https://bmcsindia.in/]
         `, // plain text body
        html: `  
        <div >       
        <div style="text-align: center;">
            <img style="border: 2px solid #333;" src="https://bmcsfileserver.s3.amazonaws.com/BMCS+(1).png" alt="Logo">
            <br><br><br>
            Dear <b>${name}</b>,
            <br><br>
            <p><b>Project completed Successfully!</b></p> 
        </div>
        <div style="position: relative ;left: 100px;">
            <p>We trust this message finds you well. We are thrilled to share the fantastic news 
                that the ${projectName} has reached its successful completion! <br>
                 It has been an exciting journey, and we are delighted with the results.</p>
    
                <p><b>Team Effort:</b>We would like to express our gratitude for your collaboration throughout the project. <br>
                     Your insights and cooperation played a crucial role in achieving the outstanding results we celebrate today.</p>
    
                <p><b>Celebrating Success:</b>We believe in celebrating success together. While we are immensely proud of what we've accomplished,<br>
                     we also want to acknowledge your role in making this project a triumph.</p>
    
                <p><b>Gratitude: </b>Thank you for entrusting us with ${projectName}. It has been a pleasure working with you,<br>
                     and we look forward to any future collaborations.</p>
    
                <p>If you have any questions or require additional information, please do not hesitate to reach out.<br>
                    We value our partnership and appreciate the opportunity to contribute to your success.</p>
            </p>
                </div>
            <br><br>
            <div style="text-align: center;">
    
            
            <b>Best Regards,</b>
            <br>
            <b>Team <b>BMCS India.</b></b>
    
            <br> <br>
            Support :- <a href="mailto:support@bmcsindia.in">support@bmcsindia.in</a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            visit us :- <a href="https://bmcsindia.in">https://bmcsindia.in</a>
            <br> <br>
            Follow us on
            <br> <br>
            
            <div style="margin-bottom: 50px;">
            <a href="https://www.instagram.com/bmcs_india/"><img style="height: 40px; width: 40px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png" alt="Instagram"></a> &nbsp;&nbsp;
            <a href="https://www.linkedin.com/company/bmcsindia"><img style="height: 40px; width: 40px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1200px-LinkedIn_icon.svg.png" alt="LinkedIn"><a> &nbsp;&nbsp;
            <a href="https://www.youtube.com/channel/UCA3pcjuK89SSV1sKIw1Bd6A"><img style="height: 40px; width: 40px;" src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052" alt="Youtube"></a> &nbsp;&nbsp;
            <a href="https://www.facebook.com/bmcsindiaofficial"><img style="height: 40px; width: 40px;" src="https://i.pinimg.com/originals/ce/d6/6e/ced66ecfc53814d71f8774789b55cc76.png" alt="Facebook"></a>
            </div>
        </div>
    </div>
        `, // html body
    });
    logger.info(`Email info - ${info.response , info.envelope , info.accepted , info.rejected, info.messageId}`)
    //console.log(info);
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    logger.info(successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
    logger.info(`End`);
    return (successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
} catch (error) {
    logger.error(`Error - ${error}`)
    return (error);
}
}
