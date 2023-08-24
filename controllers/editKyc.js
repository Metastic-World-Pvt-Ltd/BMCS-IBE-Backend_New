const Kyc = require('../models/Kyc');
const User = require('../models/User');
const logger = require('./logger');
const fs = require('fs');

module.exports.editKyc = async function(req, res){
try {
    logger.info(`Activated Update User Kyc Endpoint`)
    const _id = req.params.id || req.body.id || req.query.id || req.headers["id"];
    logger.info(`Input - ${req.body}`)
    const oldKycData = await Kyc.findById({_id});
    logger.info(`Body - ${oldKycData}`)
    var i = 0;
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
    }else{
         kycDocuments = oldKycData.kycDocuments;
    }
    
    
    const kycData = await Kyc.findByIdAndUpdate({_id},req.body , kycDocuments,{new:true})
    logger.info(`Record has updated`)
    return res.json("Record has updated")


    
} catch (error) {
    logger.error(`User Kyc Endpoint Failed`);
    return res.status(500).json(`Something went wrong in user kyc`)
}

}