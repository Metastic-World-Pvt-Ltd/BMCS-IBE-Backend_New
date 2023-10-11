const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const keySchema = new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    secretKey:{
        type: String,
        required:true
    },
},{
    timestamps:true
}
)

//hash password
keySchema.pre('save', async function(next){
    // console.log('inside Hash password')
     try {
         const salt = await bcrypt.genSalt(10);
         const hashedKey = await bcrypt.hash(this.secretKey , salt);
         this.secretKey = hashedKey;
         //console.log(this.password);
     } catch (error) {
         next(error);
     }
 })

module.exports =mongoose.model('APIKEY', keySchema)