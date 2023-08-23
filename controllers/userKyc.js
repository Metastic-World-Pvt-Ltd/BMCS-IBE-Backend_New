const Kyc = require('../models/Kyc');
const User = require('../models/User');
const logger = require('./logger');
const fs = require('fs');

module.exports.userKyc = async function(req, res){
    const {contact , accountNumber , ifscCode } = req.body;
    if(!contact || !accountNumber || !ifscCode ){
        return res.status(400).json('All Fileds required');
    }
    const isExist = await User.findOne({contact:contact});
    if(!isExist){
        return res.status(404).json("No user Found")
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
                     kycDocuments.push(filePath);

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
        //store data into DB
        const name = isExist.firstName + " " + isExist.lastName;
        const email = isExist.email;
        console.log(email + "type" + typeof(email));
        const status = "Verified";
        const kycData = await Kyc.create({
            name,
            contact,
            email,
            status,
            accountNumber,
            ifscCode,
            kycDocuments,
        })
        console.log(kycData);
        return res.status(200).json(kycData)
    }

}