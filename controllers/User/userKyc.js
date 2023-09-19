const Kyc = require('../../models/Kyc');
const User = require('../../models/User');
const errorMessages = require('../errorMessages');
const successMessages = require('../successMessages');
const logger = require('./logger');
const fs = require('fs');

module.exports.userKyc = async function(req, res){
try {
    logger.info(successMessages.USER_KYC_ACYIVATED)
    //user input
    const {contact , accountNumber , ifscCode } = req.body;
    logger.info(`Input - ${contact , accountNumber , ifscCode }`)
    //check for correct data or not
    if(!contact || !accountNumber || !ifscCode ){
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
    var kycDocuments = [];
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
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const filename = `${uploadedFile.fieldname}-${uniqueSuffix}.${uploadedFile.originalname.split('.').pop()}`;
                    //file path
                    var filePath = 'D:/uploads/'+ filename;
                    //write file in dir
                     fs.writeFileSync(filePath, uploadedFile.buffer);
                     //push file into array
                     logger.info(`Input - ${filePath}`)
                     kycDocuments.push(filePath);

                }else{
                    logger.error(errorMessages.MAX_ALLOWED_SIZE)
                    return res.status(400).json(errorMessages.MAX_ALLOWED_SIZE);
                  
                }

            } else {
               logger.error(errorMessages.INVALID_FILE) 
               return res.status(400).json(errorMessages.INVALID_FILE);
            }
    
        }
        //end of file upload section
        //store data into DB
        const name = isExist.firstName + " " + isExist.lastName;
        const email = isExist.email;
        console.log(email + "type" + typeof(email));
        const status = "Pending";
        const empId = isExist.empId;
        const kycData = await Kyc.create({
            name,
            contact,
            email,
            empId,
            status,
            accountNumber,
            ifscCode,
            kycDocuments,
        })
        //return the response
        logger.info(`Output - ${kycData}`)
        return res.status(200).json(kycData)
    }
} catch (error) {
    logger.error(errorMessages.USER_KYC_FAILED);
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}