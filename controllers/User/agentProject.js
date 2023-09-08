const Project = require('../../models/Project');
const fs = require('fs');
const path = require('path');
const lc = require('letter-count');
const logger = require("./logger");
module.exports.agentProject = async function(req, res){
// try {
    logger.info(`Activated Agent Project Endpoint`)
    //user input
    const {projectName , contact , projectAmount , projectType , projectDescription } = req.body;
    //check for required filed
    logger.info(`Input - ${projectName , contact , projectAmount , projectType , projectDescription}`)
    if(!projectName || !contact || !projectAmount || !projectType || !projectDescription){
        logger.error(`All fields are required`)
        return res.status(400).json('All fields are required')
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
                    logger.error(`Max allowed size is 1MB`)
                    return res.status(400).json('Max allowed size is 1MB');
                  
                }

            } else {
               logger.error(`Invalid file type`) 
               return res.status(400).json('Invalid file type');
            }
    
        }
        //end of file upload section

        //check char limit in description
        const char = lc.count(projectDescription);
        const maxChar = char.chars;
        const charLimit = 500;
       // console.log(maxChar);
        if(maxChar > charLimit){
            logger.error(`Description Characters limit is 500`)
            return res.status(400).json('Characters limit is 500')
        }

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
            logger.info(`Project has created`)
            return res.status(200).json("Project has created");
       }
       
// } catch (error) {
//     logger.error(`Create Project Endpoint Failed`)
//     return res.status(500).json('Something wrong in project creation')
// }


}