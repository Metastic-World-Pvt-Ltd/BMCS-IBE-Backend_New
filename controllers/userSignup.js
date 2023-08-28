const User = require('../models/User');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('./logger');
module.exports.userSignup = async function(req, res){
    
    try {
        logger.info(`Activated user Signup Endpoint`)
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
            logger.error(`All fields are required`)
            res.status(400).json('All fields are required')
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
            logger.error(`contact/email already exist`)
            res.status(422).json('contact/email already exist')
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
                res.status(200).json({token , userDoc})
            })
           // res.status(200).json(userDoc);
        }else{
            //referral check
            logger.info(`Referral Id - ${refId}`)
            const refExist = await User.findOne({refId:refId});
           // console.log(refExist);
            if(refExist){
                if(refExist.refCount < maxLevel){
                    var level = parseInt(refExist.refCount) +1;
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
                        logger.info(`Token - ${token}`)
                        res.status(200).json({token , userDoc})
                    })
                       // res.status(200).json(userDoc);
                }else{
                    logger.error(`something went wrong`)
                    res.status(400).json('something went wrong')
                }
            }else{
                logger.error(`RefID does not exist`)
                res.status(404).json('RefID does not exist');
            }
        }
        }


    } catch (error) {
        logger.error(`user Signup Endpoint Failed`)
        res.status(500).json('Something went wrong in Signup page')
    }

}