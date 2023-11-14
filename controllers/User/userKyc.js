const Kyc = require('../../models/Kyc');
const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const kycDocuments = [];
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

    //upload files
        const adhar = JSON.parse(req.body.Adhar);
        uploadImage(adhar)        
        const pan = JSON.parse(req.body.Pan);
        uploadImage(pan)
        const Statement_Check = JSON.parse(req.body.Statement_Check);
        uploadImage(Statement_Check)
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
           kycDocuments.push(filePath);
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