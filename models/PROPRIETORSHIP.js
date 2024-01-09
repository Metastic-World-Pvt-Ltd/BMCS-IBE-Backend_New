const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a sub-schema for subField
const subFieldSchema = new Schema({
  name: { type: String },
},{ _id: false },);

// Define a sub-schema for documents
const documentSchema = new Schema({
    
  mainField: {
    type: String,
    required: true,
  },
  subField: [subFieldSchema],
  
},{ _id: false });

// Define the project schema
const projectSchema = new Schema({
  projectId: { type: String, required: true }, 
  projectName: { type: String, required: true },
  documentList: [documentSchema],
});

const Project = mongoose.model('PROPRIETORSHIP', projectSchema);

module.exports = Project;
