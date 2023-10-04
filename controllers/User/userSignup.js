const User = require('../../models/User');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.userSignup = async function(req, res){
    
    try {
        logger.info(`Start`);
        logger.info(successMessages.USER_SIGN_UP_ACTIVATED)
        //secret key
        const secret = process.env.SECRET_KEY;
        //generate employee ID
        const data = await User.countDocuments();
    
        const year = new Date().getFullYear();
        const lastTwoDigits = year % 100;
        
        const str = 'BMCS';
        let formattedNumber;
        counter = data + 1;
        if (counter < 10) {
            formattedNumber = counter.toString().padStart(4, '0');
        } else if (counter < 100) {
            formattedNumber = counter.toString().padStart(4, '0');
        }else if (counter < 1000) {
            formattedNumber = counter.toString().padStart(4, '0');
        }
         else {
            formattedNumber = counter.toString();
            
        }
        const empId = str+lastTwoDigits+formattedNumber
        //user input
        logger.info(`Input - ${req.body}`)
        const {contact , firstName , lastName , gender , email , userRole , role , refId } = req.body;
       // console.log(req.body);
        if(!contact ,!firstName ,!lastName ,!gender ,!email ,!userRole ,!role ,!refId){
            logger.error(errorMessages.ALL_FIELDS_REQUIRED)
            return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
        }
        var newPath;
        const maxLevel = 15;
        //check for file
        if(req.file){
            const{originalname ,path} = req.file;
            const parts = originalname.split('.')
            const ext = parts[1];
            newPath = fs.renameSync(path, path+'.'+ext)
        }else{
            newPath = 'uploads\\e373b76922d49610025f2e4135af8caf.avif'
        }
        //check for contact exist or not
        const isContact = await User.findOne({contact});
        //check for email exist or not
        const isEmail = await User.findOne({email});

        //console.log(isContact);
        if(isContact || isEmail){
            logger.error(errorMessages.EMAIL_AND_CONTACT_EXIST)
            return res.status(422).json(errorMessages.EMAIL_AND_CONTACT_EXIST)
        }else{
                    //check userRole
        if(userRole == 'Admin'){
            const refId = contact;
            const refCount = 0;
            const level = 'Admin';
            const refBy = 'Admin';
            const userDoc = await User.create({
                contact ,empId, firstName , lastName,gender , email , userRole , role  , level , refId , refCount, refBy, avatar:newPath
            })
            logger.info(`Output - ${userDoc}`)
            //generate token for user
            jwt.sign({contact,firstName} , secret , { algorithm: 'HS512' } , (err,token)=>{
                if(err) throw new err;
                //logger.info(`Token - ${token}`)
                logger.info(`End`);
                return res.status(200).json({token , userDoc})
            })
           // res.status(200).json(userDoc);
        }else{
            //referral check
            logger.info(`Referral Id - ${refId}`)
            const refExist = await User.findOne({refId:refId});
            console.log(refExist);
            if(refExist){
                
                    var level ;
            console.log(refExist);
                    if(refExist.refBy == 'Admin'){
                        level = 1;
                    }else{
                        level = parseInt(refExist.level) + 1;
                    }
                    const refId = contact;
                    const refCount = 0;
                    //update ref count for user
                    const _id = refExist.id;
                    const refExitCount = parseInt(refExist.refCount) + 1;
                   const updateRef =  await User.findByIdAndUpdate(_id, {refCount:refExitCount})
                   //console.log("update ref",updateRef);
                   const refBy = refExist.refId;
                    //create user
                    const userDoc = await User.create({
                    contact ,empId, firstName , lastName , gender, email , userRole , role  , level , refId , refCount, refBy , avatar:newPath
                })
                logger.info(`Output - ${userDoc}`)
                //generate token for user
                    jwt.sign({contact,firstName} , secret , { algorithm: 'HS512' } , (err,token)=>{
                        if(err) throw new err;
                        logger.info(`Token - ${userDoc}`)
                        logger.info(`End`);
                        return res.status(200).json({token , userDoc})
                    })

            }else{
                logger.error(errorMessages.REFID_DOSE_NOT_EXIST)
                return res.status(404).json(errorMessages.REFID_DOSE_NOT_EXIST);
            }
        }
        }

    } catch (error) {
        logger.error(errorMessages.USER_SIGNUP_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }

}