const { error } = require('console');
const HomeBanner = require('../../models/HomeBanner');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');
const fs =  require('fs')
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
module.exports.bannerHome = async function(req , res){
try {
        logger.info(successMessages.START)
        logger.info(successMessages.BANNER_HOME_ACTIVATED)
        const {title ,bannerType}  = req.body;
        logger.info(`Input - ${title}`)
        if(!title){
            logger.error(errorMessages.TITLE_IS_REQUIRED)
            return res.status(400).json(errorMessages.TITLE_IS_REQUIRED)
        }
        var projectDocuments ;
        //upload files
        try {
            if(req.files){
                //store file path
                console.log();
                   const mim = JSON.parse(req.body.imageURL);
                   
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
              
              //     }
              
              }else{
                  logger.error(errorMessages.ALL_FIELDS_REQUIRED)
                  return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
              }
        } catch (error) {
            logger.error(error)
            return res.json(errorMessages.SOMETHING_WENT_WRONG)
        }
                

        const isExist = await HomeBanner.findOne({title});

        if(isExist){
            logger.error(errorMessages.BANNER_NAME_EXIST)
            return res.status(422).json(errorMessages.BANNER_NAME_EXIST)
        }
    try {
        const id = Date.now();
        const bannerData = await HomeBanner.create({
        id ,  title , imageURL:filePath ,bannerType , hidden:false
        })
        logger.info(`Output - ${bannerData}`)
        logger.info(successMessages.END)
        res.json(bannerData);
    } catch (error) {
        logger.error(errorMessages.BAD_GATEWAY);
        return res.status(502).json(errorMessages.BAD_GATEWAY);
    }
} catch (error) {
    logger.error(errorMessages.BANNER_HOME_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}


}