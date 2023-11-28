const Kyc = require('../../models/Kyc');
const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
var kycDocuments = [];

module.exports.editKyc = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.EDIT_KYC_ACTIVATED)
    //user input 
    const empId = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Input - ${req.body}`)
    //check old kyc data 
    const oldKycData = await Kyc.findOne({empId});
    logger.info(`Body - ${oldKycData}`)
    
        //upload files
        // const adhar = JSON.parse(req.body.Adhar);
        // uploadImage(adhar)        
        // const pan = JSON.parse(req.body.Pan);
        // uploadImage(pan)
        // const Statement_Check = JSON.parse(req.body.Statement_Check);
        // uploadImage(Statement_Check)
          
      //end of file upload section

          //upload files
          const frontAdhar = await uploadImage(req.files.frontAdhar[0])
          if(frontAdhar == 'Invalid file type'){
           var kycDocuments = [];
           return res.status(498).json(errorMessages.INVALID_FILE)
          }
           if(frontAdhar == 'Max allowed size is 1MB'){
               var kycDocuments = [];
               return res.status(498).json(errorMessages.MAX_ALLOWED_SIZE)
           }
           // const pan = JSON.parse(req.body.Pan);
           const backAdhar = await uploadImage(req.files.backAdhar[0])
           if(backAdhar == 'Invalid file type'){
               var kycDocuments = [];
               return res.status(498).json(errorMessages.INVALID_FILE)
              }
           if(backAdhar == 'Max allowed size is 1MB'){
               var kycDocuments = [];
               return res.status(498).json(errorMessages.MAX_ALLOWED_SIZE)
            }
           const Pan = await uploadImage(req.files.Pan[0])
           if(Pan == 'Invalid file type'){
               var kycDocuments = [];
               return res.status(498).json(errorMessages.INVALID_FILE)
              }
           if(Pan == 'Max allowed size is 1MB'){
               var kycDocuments = [];
               return res.status(498).json(errorMessages.MAX_ALLOWED_SIZE)
            }
           // const cPan = JSON.parse(req.body.cPan);
           const Statement_Check = await uploadImage(req.files.Statement_Check[0])
           if(Statement_Check == 'Invalid file type'){
               var kycDocuments = [];
               return res.status(498).json(errorMessages.INVALID_FILE)
              }
           if(Statement_Check == 'Max allowed size is 1MB'){
               var kycDocuments = [];
               return res.status(498).json(errorMessages.MAX_ALLOWED_SIZE)
            }
           //end of file upload section
    
    
    //update data 
    const kycData = await Kyc.findOneAndUpdate({empId},req.body , kycDocuments,{new:true})
    kycDocuments = [];
    logger.info(successMessages.RECORD_UPDATED_SUCCESSFULLY)
    logger.info(`End`);
    return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY)


    
} catch (error) {
    logger.error(errorMessages.EDIT_KYC_FAILED);
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
            var filePath = 'https://bmcsfileserver.s3.amazonaws.com/User_Kyc/'+filename;
            kycDocuments.push(filePath);
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
                      Key: 'User_Kyc/'+fileName,
                      ContentType: 'image/png',
                      Body: fileContent,
                    };
                    try {
                      // Upload the file to S3
                      const uploadResponse = await s3.send(new PutObjectCommand(params));
                      fileContent = Buffer.alloc(0);
                    } catch (err) {
                      kycDocuments = [];
                      console.error('Error uploading to S3 or saving to MongoDB:', err);
                      return (errorMessages.SOMETHING_WENT_WRONG);
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
    return ('Error in Uploading file')
  }
    
  }