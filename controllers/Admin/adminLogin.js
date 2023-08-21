const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'});


module.exports.adminLogin = async function(req, res){
    const {email , password} = req.body;
    const secret = process.env.SECRET_KEY;
    
    const userLogin = await AdminUser.findOne({email: email});
     // console.log(userLogin);

    if(!userLogin){
        // console.log('Invalid username or password');
        res.status(400).json({message:'Invalid username or password'})
    }else{
        // console.log(password);
        const isMatch = bcrypt.compareSync(password, userLogin.password); ;
        if(!isMatch){
            // console.log('Invalid username or password');
            res.status(400).json({message:'Invalid username or password'})
        }else{
            jwt.sign({email,id:userLogin._id,role:userLogin.role},secret , {} , (err,token)=>{
                if(err) throw new err;
                
                res.status(200).cookie('token',token).json({
                    id:userLogin._id,
                    name:userLogin.name,
                    role:userLogin.role,
                    token,
                    
                })
            })
        }
    }
}
