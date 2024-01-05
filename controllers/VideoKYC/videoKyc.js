const VideoKYC = require('../../models/VideoKYC');
const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
var kycDocuments ;
module.exports.videoKyc = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.USER_KYC_ACYIVATED)
    //user input
    const {empId , isIBE, videoURL } = req.body;
    logger.info(`Input - ${empId} ,${isIBE} ${videoURL} }`)
    //check for correct data or not
    if(!empId || !isIBE || !videoURL ){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    //check record exist in DB or not
    const isExist = await User.findOne({empId});
    if(!isExist){
        logger.error(errorMessages.NOT_FOUND)
        return res.status(404).json(errorMessages.NOT_FOUND)
    }else{
    //store file path

    // //upload files
    //     const adhar = JSON.parse(req.body.Adhar);
    //     uploadImage(adhar)        
    //     const pan = JSON.parse(req.body.Pan);
    //     uploadImage(pan)
    //     const Statement_Check = JSON.parse(req.body.Statement_Check);
    //     uploadImage(Statement_Check)
    //     //end of file upload section

              //upload files
             
               // const cPan = JSON.parse(req.body.cPan);
               const videoURL = await uploadImage(req.files.Statement_Check[0])
               
               //end of file upload section

        //store data into DB
        const name = isExist.fullName;
        const contact = isExist.contact;
        const email = isExist.email;
        const status = "Pending";
        
      try {
        const kycData = await VideoKYC.create({
          name,
          contact,
          email,
          empId,
          status,
          kycDocuments,
      })
      //return the response
      logger.info(`Output - ${kycData}`)
      logger.info(successMessages.END);
      // const isKyc = "true";
      // const updateStatus = await User.findOneAndUpdate({contact},{isKyc},{new:true});
    
      return res.status(200).json(kycData)
      } catch (error) {
        logger.error(error)
        return res.status(502).json(errorMessages.BAD_GATEWAY);
      }
    }
} catch (error) {
    logger.error(errorMessages.USER_KYC_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}

async function uploadImage(mim){
  try {
    //split file extention name
  const parts = mim.mimetype.split('/')
  const ext = parts[1];
 
            //file name
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
              const filename = `${mim.fieldname}-${uniqueSuffix}.${mim.originalname.split('.').pop()}`;
              //write file in dir
             
          //Store filepath
          var filePath = 'https://bmcsfileserver.s3.amazonaws.com/Video_Kyc/'+filename;
           kycDocuments = filePath;
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
                    Key: 'Video_Kyc/'+fileName,
                    ContentType: 'video/mp4',
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
         
      
  } catch (error) {
    return ('Error in Uploading file')
  }
  
}