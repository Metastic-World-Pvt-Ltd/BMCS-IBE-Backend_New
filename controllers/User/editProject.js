const Project = require('../../models/Project');
const fs = require('fs');
const lc = require('letter-count');
const logger = require("./logger");
const successMessages = require('../successMessages');
const errorMessages = require('../errorMessages');
module.exports.editProject = async function(req, res){
    try {
        logger.info(successMessages.EDIT_PROJECT_ACTIVATED)
        var projectDocuments = [];
        var i =0;
        
        const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
        //const _id = '64e31eb98a9cdb31b51695b9';
        //console.log("Id",_id);
        logger.info(`Id - ${_id}`)
        if(!_id){
            logger.error(errorMessages.UNIQUE_ID_MISSING)
            return res.status(400).json(errorMessages.UNIQUE_ID_MISSING)
        }
         //console.log("files",req.files);
        const checkStatus = await Project.findById({_id});
        //console.log(checkStatus);
        if(checkStatus == null){
            logger.error(errorMessages.NOT_FOUND)
            return res.status(404).json(errorMessages.NOT_FOUND);
        }
        if(checkStatus.projectStatus == 'Inprogress'){
            //allow user to update project details
                //user input
                logger.info(`Input - ${req.body}`)
            const {projectName , contact , projectAmount , projectType , projectDescription } = req.body;
            //check for required filed
            if(!projectName || !contact || !projectAmount || !projectType || !projectDescription){
                logger.error(errorMessages.ALL_FIELDS_REQUIRED)
                return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
            }
            //upload files
            for (const field of Object.keys(req.files)){
                // console.log("inside file work");
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
                             var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                             var filename = `${uploadedFile.fieldname}-${uniqueSuffix}.${uploadedFile.originalname.split('.').pop()}`;
                           //file path
                        var filePath = 'D:/uploads/'+ filename;
                        //write file in dir
                        //console.log("checkStatus.projectDocuments[i]",checkStatus.projectDocuments[i]);
                        const oldPath = checkStatus.projectDocuments[i];
                        //rename existing file
                         fs.renameSync(oldPath , filePath ,() => {
                            //console.log("\nFile Renamed!\n")
                        })
                       //write data on new file path
                        fs.writeFileSync(filePath, uploadedFile.buffer);
                        //push file into array
                        projectDocuments.push(filePath);

                         i++; 

                           
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
                    logger.error(errorMessages.MAX_ALLOWED_SIZE)
                    return res.status(400).json(errorMessages.MAX_ALLOWED_SIZE)
                }

                    
                    //console.log("file path",projectDocuments);
                const projectData = await Project.findByIdAndUpdate({_id},{
                    projectName,
                    contact,
                    projectAmount,
                    projectType,
                    projectDescription, 
                    projectDocuments:projectDocuments,
                });
                logger.info(`Output - ${projectData}`)
                //console.log("Project data",projectData);
            if(projectData){
                    logger.error(successMessages.RECORD_UPDATED_SUCCESSFULLY)
                    return  res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY);
            }
        
        }else{
            logger.error(`${errorMessages.ACTION_NOT_ALLOWED}  ${checkStatus.projectStatus}`)
            return res.status(405).json(`${errorMessages.ACTION_NOT_ALLOWED}  ${checkStatus.projectStatus}`)
        }


    } catch (error) {
        logger.error(errorMessages.EDIT_PROJECT_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
        
}