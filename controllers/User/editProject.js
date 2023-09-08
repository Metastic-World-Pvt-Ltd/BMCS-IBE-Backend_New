const Project = require('../../models/Project');
const fs = require('fs');
const lc = require('letter-count');
const logger = require("./logger");
module.exports.editProject = async function(req, res){
    try {
        logger.info(`Activated Edit Project Endpoint`)
        var projectDocuments = [];
        var i =0;
        
        const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
        //const _id = '64e31eb98a9cdb31b51695b9';
        //console.log("Id",_id);
        logger.info(`Id - ${_id}`)
        if(!_id){
            logger.error(`Unique ID is missing`)
            return res.status(400).json('Unique ID is missing')
        }
         //console.log("files",req.files);
        const checkStatus = await Project.findById({_id});
        //console.log(checkStatus);
        if(checkStatus == null){
            logger.error(`NO record found`)
            return res.status(404).json("NO record found");
        }
        if(checkStatus.projectStatus == 'Inprogress'){
            //allow user to update project details
                //user input
                logger.info(`Input - ${req.body}`)
            const {projectName , contact , projectAmount , projectType , projectDescription } = req.body;
            //check for required filed
            if(!projectName || !contact || !projectAmount || !projectType || !projectDescription){
                logger.error(`All fields are required`)
                return res.status(400).json('All fields are required')
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
                    logger.error(`Record has been updated'`)
                    return  res.status(200).json('Record has been updated');
            }
        
        }else{
            logger.error(`Action not allowed as Status is ${checkStatus.projectStatus}`)
            return res.status(405).json(`Action not allowed as Status is ${checkStatus.projectStatus}`)
        }


    } catch (error) {
        logger.error(`Edit Project Endpoint Failed`)
        return res.status(500).json('Something wrong in Fetchingproject Data')
    }
        
}