const mongoose =  require('mongoose');

const userData =  new mongoose.Schema({
    contact:{
        type:String,
        required:true
    }
    ,
    empId:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    userRole:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    }, 
    level:{
        type:String,
        required:true
    },
    refId:{
        type:String,
        required:true
    } , 
    refCount:{
        type:String,
        required:true
    }, 
    refBy:{
        type:String,
        required:true
    },
    userStatus:{
        type:String,
        required:true
    },
    setPin:{
        type:String,
    },
    isKyc:{
        type:String,
    }

},{
    timestamps:true
})

module.exports = mongoose.model('User', userData);