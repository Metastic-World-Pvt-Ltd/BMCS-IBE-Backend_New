const { error } = require('console');
const HomeBanner = require('../../models/HomeBanner');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');
const fs =  require('fs')
module.exports.bannerHome = async function(req , res){
try {
        logger.info(successMessages.START)
        logger.info(successMessages.BANNER_HOME_ACTIVATED)
        const title  = req.body.title;
        logger.info(`Input - ${title}`)
        if(!title){
            logger.error(errorMessages.TITLE_IS_REQUIRED)
            return res.status(400).json(errorMessages.TITLE_IS_REQUIRED)
        }
        var projectDocuments ;
        //upload files
        if(req.files){
            
                //store file path
                const mim =  JSON.parse(req.body.imageURL);
                logger.info(`Input File - ${mim.filename}`)
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
                        //file path
                        var filePath = 'D:/Banner/'+ filename;
                        //write file in dir
                        //write file in dir
                        var mybuffer = new Buffer(mim.buffer.length)
                        for(var i=0;i<mim.buffer.length;i++){
                        mybuffer[i]=mim.buffer[i];
                        }
                        fs.writeFile(filePath,mybuffer,function(err){
                        if(err){
                            console.log(err);
                        }
                        else{
                            logger.info("saved")
                        }
                        });
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
                

        const isExist = await HomeBanner.findOne({title});

        if(isExist){
            logger.error(errorMessages.BANNER_NAME_EXIST)
            return res.status(422).json(errorMessages.BANNER_NAME_EXIST)
        }
    try {
        const id = Date.now();
        const bannerData = await HomeBanner.create({
        id ,  title , imageURL:filePath , hidden:false
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