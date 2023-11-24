const mongoose =  require('mongoose');


const projectData =  new mongoose.Schema({
    projectId:{
        type:String,
        required:true,
    },
    projectName:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true
    },
    projectAmount:{
        type:Number,
        required:true,
    },
    sanctionedAmount:{
        type:Number,
    },
    comissionAmount:{
        type:Number,
    },
    projectType:{
        type:String,
        required:true,
    },
    industryType:{
        type:String,
        required:true,
    },
    projectDescription:{
        type:String,
        required:true,
    },
    projectDocuments:{
        type:[String],
        required:true,
    },
    projectStatus:{
        type:String,
        required:true,
    }, 
    comment:{
        type:[String],
    },
    address:{
        district:{
            type:String,
        }, 
        city:{
            type:String,
            required:true,
        }, 
        state:{
            type:String,
            required:true,
        }, 
        country:{
            type:String,
            required:true,
        },
        pinCode:{
            type:String,
            required:true,
        },
    },
    acceptedBy:{
        type:String,
    },
    closedBy:{
        type:String,
    },

},{
    timestamps:true
})

module.exports = mongoose.model('Project', projectData);