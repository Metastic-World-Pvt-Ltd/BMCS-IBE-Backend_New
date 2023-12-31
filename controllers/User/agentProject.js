const Project = require('../../models/Project');
const Ticket = require('../../models/Loan');
const TicketHistory =  require('../../models/TicketHistory');
const fs = require('fs');
const path = require('path');
const lc = require('letter-count');
const logger = require("./logger");
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
//const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
var projectDocuments = [];
module.exports.agentProject = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.AGENT_PROJECT_ACTIVATED)
    //user input
    var {projectFor ,projectName , contact , projectAmount , projectType, companyType, clientType , industryType , projectDescription , address } = req.body;
    //check for required filed
     console.log("Body Data",req.body);
     console.log("Files",req.files);
    // console.log("File",req.file);
    logger.info(`Input - ${projectFor,projectName , contact , projectAmount, companyType,clientType , projectType , projectDescription}`)
    if(!projectName || !projectFor || !contact || !projectAmount || !projectType || !companyType || !clientType || !industryType  || !projectDescription || !address){
        logger.error(errorMessages.ALL_FILEDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FILEDS_REQUIRED)
    }
    //store address
    address = JSON.parse(req.body.address);
//console.log("frontAdhar Data",req.files.frontAdhar[0].fieldname);
    //store file path
    // var projectDocuments = [];
  //  console.log('outside Loop');
    //upload files
    //for (const field of Object.keys(req.files)){
        //const adhar = JSON.parse(req.body.Adhar);
       const frontAdhar = await uploadImage(req.files.frontAdhar[0])
       if(frontAdhar == 'Invalid file type'){
        projectDocuments = [];
        return res.status(498).json(errorMessages.FRONT_ADHAR_INVALID_IMAGE)
       }
        if(frontAdhar == 'Max allowed size is 1MB'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.FRONT_ADHAR_MAX_SIZE)
        }
        // const pan = JSON.parse(req.body.Pan);
        const backAdhar = await uploadImage(req.files.backAdhar[0])
        if(backAdhar == 'Invalid file type'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.BACK_ADHAR_INVALID_IMAGE)
           }
        if(backAdhar == 'Max allowed size is 1MB'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.BACK_ADHAR_MAX_SIZE)
         }
        const Pan = await uploadImage(req.files.Pan[0])
        if(Pan == 'Invalid file type'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.PAN_INVALID_IMAGE)
           }
        if(Pan == 'Max allowed size is 1MB'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.PAN_MAX_SIZE)
         }
        // const cAdhar = JSON.parse(req.body.cAdhar);
        const GST = await uploadImage(req.files.GST[0])
        if(GST == 'Invalid file type'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.GST_INVALID_IMAGE)
           }
        if(GST == 'Max allowed size is 1MB'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.GST_MAX_SIZE)
         }
        // const cPan = JSON.parse(req.body.cPan);
        const cPan = await uploadImage(req.files.cPan[0])
        if(cPan == 'Invalid file type'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.COMPANY_PAN_INVALID_IMAGE)
           }
        if(cPan == 'Max allowed size is 1MB'){
            projectDocuments = [];
            return res.status(498).json(errorMessages.COMPANY_PAN_MAX_SIZE)
         }
     
        //end of file upload section
        //check char limit in description
        const char = lc.count(projectDescription);
        const maxChar = char.chars;
        const charLimit = 500;
       // console.log(maxChar);
        if(maxChar > charLimit){
            logger.error(errorMessages.DISCRIPTION_CHAR_LIMIT)
            return res.status(400).json(errorMessages.DISCRIPTION_CHAR_LIMIT)
        }
        const isExist = await Project.find({projectName});
        if(isExist.length == 0){
        //generate project ID
        const part1 = Math.floor(1000 + Math.random() *1E7);
        const randomNumber = part1.toString();
       // console.log(randomNumber);
       const typeChar = projectType.substr(0, 3);
       const upperCase = typeChar.toUpperCase();
       const projectId =  upperCase + randomNumber ;
        //create project and push data to DB
       const status = "New";
       const projectData = new Project({
        projectId,
        projectFor,
        projectName,
        contact,
        projectAmount,
        projectType,
        companyType,
        clientType,
        industryType,
        projectDescription,
        projectDocuments:projectDocuments,
        projectStatus:status,
        address:address,
        acceptedBy:'',
       })
      // console.log(projectData);
       await projectData.save();
       projectDocuments = [];
       logger.info(`Output - ${projectData}`)
       //if Projectadata
       if(projectData){
            const isExist = await Ticket.findOne({contact});
           // console.log(isExist);
            if(isExist != null){
                try {
                    const newStatus = 'In Progress';
                    const updateStatus = await Ticket.findOneAndUpdate({contact:contact},{projectStatus:newStatus},{new:true})
                    logger.info(`Ticket Status updated`);
                   // console.log(updateStatus);
                    const ticketId = updateStatus.ticketId;
                    const status = newStatus;
                    const ticketData = await TicketHistory.create({
                        contact , ticketId ,status,
                    })
                    // console.log(ticketData);
                    logger.info(`Ticket History Created - ${ticketData}`);
                } catch (error) {
                    logger.error(error)
                    return res.json(error)
                }
            }
            logger.info(successMessages.PROJECT_CREATED_SUCCESSFULLY)
            logger.info(`End`);
            return res.status(200).json(successMessages.PROJECT_CREATED_SUCCESSFULLY);
        }
       }else{
        projectDocuments = [];
        logger.error(errorMessages.PROJECT_ALREADY_EXIST);
        return res.status(400).json(errorMessages.PROJECT_ALREADY_EXIST);
       }
} catch (error) {
    projectDocuments = [];
    logger.error(errorMessages.CREATE_PROEJCT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}
async function uploadImage(mim){
    try {
        //split file extention name
    const parts = mim.mimetype.split('/')
    const ext = parts[1];
    //define allowed file types
    const allowedTypes = ['image/jpeg', 'image/jpg','image/png'];
        if (allowedTypes.includes(mim.mimetype)) {
            //check file size
            if(mim.size < 1000000){
            //file name
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = `${mim.fieldname}-${uniqueSuffix}.${mim.originalname.split('.').pop()}`;
            //Store filepath
            var filePath = 'https://bmcsfileserver.s3.amazonaws.com/IBE_Project/'+filename;
             projectDocuments.push(filePath);
            //aws opertaion
                const credentials = {
                    accessKeyId: process.env.ACCESS_KEY,
                    secretAccessKey: process.env.SECERET_KEY
                  };
                  const region = process.env.BUCKET_REGION;
                  const bucketName = process.env.BUCKET_NAME;
                  const fileName = filename;
                  var fileContent = Buffer.from(mim.buffer);;
                  const s3 = new S3Client({ region, credentials });
                  async function uploadFileAndSaveToDatabase() {
                    // Set the S3 parameters
                    const params = {
                      Bucket: bucketName,
                      Key: 'IBE_Project/'+filename,
                      ContentType: 'image/png',
                      Body: fileContent,
                    };
                    try {
                      // Upload the file to S3
                      const uploadResponse = await s3.send(new PutObjectCommand(params));
                      console.log("uploadResponse",uploadResponse);
                      fileContent = Buffer.alloc(0);
                    } catch (err) {
                      projectDocuments = [];
                      console.error('Error uploading to S3 or saving to MongoDB:', err);
                      return res.status(498).json(errorMessages.SOMETHING_WENT_WRONG);
                    }
                  }
                  // Call the function to upload the file and save the S3 URL to the database
                  uploadFileAndSaveToDatabase();
                //end of Aws
            }else{
                logger.error(errorMessages.MAX_ALLOWED_SIZE)
                return (errorMessages.MAX_ALLOWED_SIZE);
            }
        } else {
        logger.error(errorMessages.INVALID_FILE)
        return (errorMessages.INVALID_FILE);
        }
    } catch (error) {
        logger.error(error)
        return (errorMessages.SOMETHING_WENT_WRONG)
    }
    
  }