const Kyc = require('../../models/Kyc');
const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
const fs = require('fs');

module.exports.editKyc = async function(req, res){
try {
    logger.info(`Start`);
    logger.info(successMessages.EDIT_KYC_ACTIVATED)
    //user input 
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Input - ${req.body}`)
    //check old kyc data 
    const oldKycData = await Kyc.findById({_id});
    logger.info(`Body - ${oldKycData}`)
    //to run loop
    var i = 0;
    //to store all Kyc documents
    var kycDocuments = [];
    if(req.files || req.file){
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
                        
                        const oldPath = oldKycData.kycDocuments[i];
                        //rename existing file
                         fs.renameSync(oldPath , filePath ,() => {
                            //console.log("\nFile Renamed!\n")
                        })
                       //write data on new file path
                        fs.writeFileSync(filePath, uploadedFile.buffer);
                        //push file into array
                        kycDocuments.push(filePath);
                        //increase i to travelfuther
                         i++; 

                           
                        }else{
                            //size check 
                            logger.error(errorMessages.MAX_ALLOWED_SIZE)
                            return res.status(400).json(errorMessages.MAX_ALLOWED_SIZE);
                        
                        }

                    } else {
                        //invalid file type response
                        logger.error(errorMessages.INVALID_FILE)
                        return res.status(400).json(errorMessages.INVALID_FILE);
                    }
            
                }
                //end of file upload section
    }else{
        //previuos kyc docs
         kycDocuments = oldKycData.kycDocuments;
    }
    
    //update data 
    const kycData = await Kyc.findByIdAndUpdate({_id},req.body , kycDocuments,{new:true})
    logger.info(successMessages.RECORD_UPDATED_SUCCESSFULLY)
    logger.info(`End`);
    return res.status(200).json(successMessages.RECORD_UPDATED_SUCCESSFULLY)


    
} catch (error) {
    logger.error(errorMessages.EDIT_KYC_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}