const Project = require('../../models/ClientProduct');
const fs = require('fs');
const lc = require('letter-count');
const logger = require("./logger");
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const projectDocuments = [];
module.exports.editProject = async function(req, res){
    try {
        logger.info(successMessages.START);
        logger.info(successMessages.EDIT_PROJECT_ACTIVATED)
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
            const adhar = JSON.parse(req.body.Adhar);
            uploadImage(adhar)        
            const pan = JSON.parse(req.body.Pan);
            uploadImage(pan)
            const cAdhar = JSON.parse(req.body.cAdhar);
            uploadImage(cAdhar)
            const cPan = JSON.parse(req.body.cPan);
            uploadImage(pan)
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
                    logger.info(successMessages.RECORD_UPDATED_SUCCESSFULLY)
                    logger.info(`End`);
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

async function uploadImage(mim){
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
                //write file in dir
                var mybuffer = new Buffer(mim.buffer.length)
              for(var i=0;i<mim.buffer.length;i++){
                mybuffer[i]=mim.buffer[i];
              }
            //Store filepath
            var filePath = 'https://bmcsfileserver.s3.amazonaws.com/'+filename;
             projectDocuments.push(filePath);
            //aws opertaion
                const credentials = {
                    accessKeyId: process.env.ACCESS_KEY,
                    secretAccessKey: process.env.SECERET_KEY
                  };
                  const region = process.env.BUCKET_REGION;
                  const bucketName = process.env.BUCKET_NAME;
                  const fileName = filename;
                  const fileContent = Buffer.from(mybuffer);;
                  const s3 = new S3Client({ region, credentials });
                  async function uploadFileAndSaveToDatabase() {
                    // Set the S3 parameters
                    const params = {
                      Bucket: bucketName,
                      Key: fileName,
                      ContentType: 'image/png',
                      Body: fileContent,
                    };
                    try {
                      // Upload the file to S3
                      const uploadResponse = await s3.send(new PutObjectCommand(params));
                    } catch (err) {
                      console.error('Error uploading to S3 or saving to MongoDB:', err);
                      return res.json(errorMessages.SOMETHING_WENT_WRONG);
                    }
                  }
                  // Call the function to upload the file and save the S3 URL to the database
                  uploadFileAndSaveToDatabase();
                //end of Aws
            }else{
                logger.error(errorMessages.MAX_ALLOWED_SIZE)
                return res.status(400).json(errorMessages.MAX_ALLOWED_SIZE);
            }
        } else {
        logger.error(errorMessages.INVALID_FILE)
        return res.status(400).json(errorMessages.INVALID_FILE);
        }
  }