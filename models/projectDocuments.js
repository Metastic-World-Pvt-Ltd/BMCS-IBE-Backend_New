const mongoose =  require('mongoose');



// const projectData =  new mongoose.Schema({
//     projectName:{
//         type:String,
//         required:true,
//     },
//     documentList:[String],

// },{
//     timestamps:true
// })

// Document Schema
const documentSchema = new mongoose.Schema({
    name: [String],
  });
  
  // Project Schema
  const projectSchema = new mongoose.Schema({
    projectId:{
        type:String
    },
    projectName: {
      type: String,
      required: true,
    },
    documentList: {
      type: [documentSchema],
      validate: {
        validator: function (value) {
          // Validate that documentList is an array with at least one document
          return value && value.length > 0;
        },
        message: 'At least one document is required.',
      },
    },
  });

module.exports = mongoose.model('projectDocuments', projectSchema);