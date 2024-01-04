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
    fullName:{
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
    },
    isIBE:{
        type:String,
    },
    dob:{
        type:String,
    },
    address:{
        district:{
            type:String,
        }, 
        city:{
            type:String,
        }, 
        state:{
            type:String,
        }, 
        country:{
            type:String,
        },
        pinCode:{
            type:String,
        },
    },
    

},{
    timestamps:true
})

module.exports = mongoose.model('User', userData);