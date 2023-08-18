const Project = require('../models/Project');
const fs = require('fs');
const lc = require('letter-count');
module.exports.editProject = async function(req, res){
    // try {
        console.log('inside edit project');
        // const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
        const _id = '64df64ecb42bbc154bc55c4f';
        console.log("Id",_id);
        if(!_id){
            return res.status(400).json('Unique ID is missing')
        }
        console.log("files",req.files);
        const checkStatus = await Project.findById({_id});
        console.log(checkStatus);
        if(checkStatus.projectStatus == 'Inprogress'){
            //allow user to update project details
                //user input
            const {projectName , contact , projectAmount , projectType , projectDescription } = req.body;
            //check for required filed
            if(!projectName || !contact || !projectAmount || !projectType || !projectDescription){
                return res.status(400).json('All fields are required')
            }
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
                            // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                            // const filename = `file-${uniqueSuffix}.${uploadedFile.originalname.split('.').pop()}`;
                            //file path
                           // var filePath = 'D:/uploads/'+ filename;
                           var filePath = checkStatus.projectDocuments;
                            //write file in dir
                            fs.writeFileSync(filePath, uploadedFile.buffer);

                        }else{
                            return res.status(400).json('Max allowed size is 1MB');
                        
                        }

                    } else {
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
                    return res.status(400).json('Characters limit is 500')
                }


                const projectData = await Project.findByIdAndUpdate({_id},{
                    projectName,
                    contact,
                    projectAmount,
                    projectType,
                    projectDescription, 
                    projectDocuments:filePath,
                });
                console.log(projectData);
            if(projectData){
                    return  res.status(200).json('Record has been updated');
            }
        
        }else{
            return res.status(405).json(`Action not allowed as Status is ${checkStatus.projectStatus}`)
        }


    // } catch (error) {
    //     return res.status(500).json('Something wrong in Fetchingproject Data')
    // }
        
}