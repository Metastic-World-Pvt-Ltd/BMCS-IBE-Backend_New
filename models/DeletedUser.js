const mongoose =  require('mongoose');

const userData =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
    },
    empId:{
        type:String,
    },
    role:{
        type:String,
        required:true,
    },
    refBy:{
        type:String,
    },
    deletedBy:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('DeletedUser', userData);