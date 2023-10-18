const HomeBanner = require('../../models/HomeBanner');
const logger = require('../User/logger');
const fs =  require('fs')
module.exports.bannerHome = async function(req , res){
    const title  = req.body.title;
    console.log("title",title);
    if(!title){
        return res.status(400).json('Title is required')
    }
    var projectDocuments ;
    
        const data = req.files;

            //store file path
            const mim = data.Banner[0];
        // console.log("data",mim.mimetype);
        // res.json("ok")

    //upload files
    // for (const field of Object.keys(req.files)){
        // const uploadedFile = req.files[0];
        // //split file extention name       
        // const parts = uploadedFile.mimetype.split('/')
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
                     fs.writeFileSync(filePath, mim.buffer);
                     //push file into array
                    //  projectDocuments.push(filePath);
                    console.log("filePath",filePath);

                }else{
                    logger.error(errorMessages.MAX_ALLOWED_SIZE)
                    return res.status(400).json(errorMessages.MAX_ALLOWED_SIZE);
                  
                }

            } else {
               logger.error(errorMessages.INVALID_FILE) 
               return res.status(400).json(errorMessages.INVALID_FILE);
            }
    
    //     }
    

    const isExist = await HomeBanner.findOne({title});

    if(isExist){
        return res.status(422).json(`Banner name already exist`);
    }
    const id = Date.now();
    const bannerData = await HomeBanner.create({
       id ,  title , imageURL:filePath , hidden:false
    })

    res.json(bannerData);


}