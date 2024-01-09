const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a sub-schema for documents
const documentSchema = new Schema({
  name: [{ type: String, required: true }],
  
});

// Define the project schema
const projectSchema = new Schema({
  projectId: { type: String, required: true }, 
  projectName: { type: String, required: true },
  documents: [documentSchema],
});

const Project = mongoose.model('PROPRIETORSHIP', projectSchema);

module.exports = Project;
