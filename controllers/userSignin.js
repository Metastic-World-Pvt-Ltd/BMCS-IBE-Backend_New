const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports.userSignin =  async function(req, res){
try {
    const {contact} = req.body;
    const userDoc = await User.findOne({contact:contact});
    if(userDoc){
       //generate token for user
       const firstName = userDoc.firstName;
       const secret = process.env.SECRET_KEY;
        jwt.sign({contact,firstName} , secret , { algorithm: 'HS512' } , (err,token)=>{
          if(err) throw new err;
            res.status(200).json({token , userDoc})
           })
       // res.status(200).json('user verified')
    }else{
        res.status(404).json('user does not exist')
    }
} catch (error) {
    res.status(400).json('Something went wrong in Signin')
}
}