const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const pinSchema = new mongoose.Schema({
    contact:{
        type: String,
        required:true
    },
    PIN:{
        type: String,
        required:true
    },
},{
    timestamps:true
}
)

//hash password
pinSchema.pre('save', async function(next){
    // console.log('inside Hash password')
     try {
         const salt = await bcrypt.genSalt(10);
         const hashedPIN = await bcrypt.hash(this.PIN , salt);
         this.PIN = hashedPIN;
         //console.log(this.password);
     } catch (error) {
         next(error);
     }
 })

module.exports =mongoose.model('PIN', pinSchema)