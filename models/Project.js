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
        type:String,
        required:true,
    },
    projectType:{
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
        type:String,
    }

},{
    timestamps:true
})

module.exports = mongoose.model('Project', projectData);