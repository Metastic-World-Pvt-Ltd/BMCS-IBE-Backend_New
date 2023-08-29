const mongoose = require('mongoose');

const twofaSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    secret:{
        type: String,
        required:true
    },
},{
    timestamps:true
}
)


module.exports =mongoose.model('2FA', twofaSchema)