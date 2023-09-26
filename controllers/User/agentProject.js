const Project = require('../../models/ClientProduct');
const Enquiry = require('../../models/Enquiry');
const TicketHistory =  require('../../models/TicketHistory');
const fs = require('fs');
const path = require('path');
const lc = require('letter-count');
const logger = require("./logger");
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.agentProject = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.AGENT_PROJECT_ACTIVATED)
    //user input
    const {projectName , contact , projectAmount , projectType , projectDescription } = req.body;
    //check for required filed
    logger.info(`Input - ${projectName , contact , projectAmount , projectType , projectDescription}`)
    if(!projectName || !contact || !projectAmount || !projectType || !projectDescription){
        logger.error(errorMessages.ALL_FILEDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FILEDS_REQUIRED)
    }
    //store file path
    var projectDocuments = [];
    //upload files
    for (const field of Object.keys(req.files)){
        const uploadedFile = req.files[field][0];
        //split file extention name       
        const parts = uploadedFile.mimetype.split('/')
        const ext = parts[1];
        //define allowed file types
        const allowedTypes = ['image/jpeg', 'image/jpg','image/png', 'application/pdf'];
            if (allowedTypes.includes(uploadedFile.mimetype)) {
                //check file size
                if(uploadedFile.size < 1000000){
                   //file name
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const filename = `${uploadedFile.fieldname}-${uniqueSuffix}.${uploadedFile.originalname.split('.').pop()}`;
                    //file path
                    var filePath = 'D:/uploads/'+ filename;
                    //write file in dir
                     fs.writeFileSync(filePath, uploadedFile.buffer);
                     //push file into array
                     projectDocuments.push(filePath);

                }else{
                    logger.error(errorMessages.MAX_ALLOWED_SIZE)
                    return res.status(400).json(errorMessages.MAX_ALLOWED_SIZE);
                  
                }

            } else {
               logger.error(errorMessages.INVALID_FILE) 
               return res.status(400).json(errorMessages.INVALID_FILE);
            }
    
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
        const status = "Inprogress";
        
       const projectData = await Project.create({
        projectId,
        projectName,
        contact,
        projectAmount,
        projectType,
        projectDescription, 
        projectDocuments:projectDocuments,
        projectStatus:status
       })
       logger.info(`Output - ${projectData}`)
       //if Projectadata 
       if(projectData){
            try {
                const newStatus = 'Work In Progress';
                const updateStatus = await Enquiry.findOneAndUpdate({contact:contact},{projectStatus:newStatus},{new:true})
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

            logger.info(successMessages.PROJECT_CREATED_SUCCESSFULLY)
            logger.info(`End`);
            return res.status(200).json(successMessages.PROJECT_CREATED_SUCCESSFULLY);
        }    
       }else{
        logger.error(errorMessages.PROJECT_ALREADY_EXIST);
        return res.status(400).json(errorMessages.PROJECT_ALREADY_EXIST);
       }
       
} catch (error) {
    logger.error(errorMessages.CREATE_PROEJCT_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}


}