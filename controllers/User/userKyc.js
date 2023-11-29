const Kyc = require('../../models/Kyc');
const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
var kycDocuments = [];
module.exports.userKyc = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.USER_KYC_ACYIVATED)
    //user input
    const {contact , accHolderName, bankName, accountNumber , ifscCode } = req.body;
    logger.info(`Input - ${contact} ,${bankName} ${accountNumber} , ${ifscCode} }`)
    //check for correct data or not
    if(!contact || !bankName || !accountNumber || !ifscCode ){
        logger.error(errorMessages.ALL_FIELDS_REQUIRED)
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }
    //check record exist in DB or not
    const isExist = await User.findOne({contact:contact});
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
              const frontAdhar = await uploadImage(req.files.frontAdhar[0])
              if(frontAdhar == 'Invalid file type'){
               kycDocuments = [];
               return res.status(498).json(errorMessages.INVALID_FILE)
              }
               if(frontAdhar == 'Max allowed size is 1MB'){
                   kycDocuments = [];
                   return res.status(498).json(errorMessages.MAX_ALLOWED_SIZE)
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
               // const cPan = JSON.parse(req.body.cPan);
               const Statement_Check = await uploadImage(req.files.Statement_Check[0])
               if(Statement_Check == 'Invalid file type'){
                   kycDocuments = [];
                   return res.status(498).json(errorMessages.STATEMENT_CHECK_INVALID_IMAGE)
                  }
               if(Statement_Check == 'Max allowed size is 1MB'){
                   kycDocuments = [];
                   return res.status(498).json(errorMessages.STATEMENT_CHECK_MAX_SIZE)
                }
               //end of file upload section

        //store data into DB
       // const name = isExist.firstName + " " + isExist.lastName;
        const email = isExist.email;
       // console.log(email + "type" + typeof(email));
        const status = "Pending";
        const empId = isExist.empId;
      try {
        const kycData = await Kyc.create({
          accHolderName,
          contact,
          email,
          empId,
          status,
          bankName,
          accountNumber,
          ifscCode,
          kycDocuments,
      })
      //return the response
      logger.info(`Output - ${kycData}`)
      logger.info(successMessages.END);
      const isKyc = "true";
      const updateStatus = await User.findOneAndUpdate({contact},{isKyc},{new:true});
      kycDocuments = [];
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
  //define allowed file types
  const allowedTypes = ['image/jpeg', 'image/jpg','image/png'];
      if (allowedTypes.includes(mim.mimetype)) {
          //check file size
          if(mim.size < 1000000){
          //file name
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
              const filename = `${mim.fieldname}-${uniqueSuffix}.${mim.originalname.split('.').pop()}`;
              //write file in dir
             
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