const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');
const { MongoClient } = require('mongodb');
module.exports.getRefChild = async function(req, res){
// try {
    logger.info(`Start`);
    logger.info(successMessages.GET_REF_CHILD_ACTIVATED);
    //define array to store referral
    const stack = [];
    var levelCount = [] ;
    var referral;
    
    //user Input
    const contact = req.headers['contact'];
    logger.info(`Input - ${contact}`);
    //check contact provided or not
    if(!contact){
        logger.error(`Error - ${errorMessages.CONTACT_IS_REQUIRED}`);
        return res.status(400).json(errorMessages.CONTACT_IS_REQUIRED);
    }
const firstRef = await User.findOne({contact}); 
    const level = [];
    var i=1;
    var totalRef = parseInt(firstRef.refCount);
// Function to retrieve child and sub-child documents
async function getChildren(contact) {
  const documents = await User.find({ refBy: contact });
  
  if (documents.length === 0) {
    return [];
  }
  //console.log(documents);
  const childDocs = [];
  
  var levelCount = 'level ' + i;
  level.push({ key: levelCount, value: documents.length });
i++;
//console.log(documents);

  for (const document of documents) {
 
    const data = parseInt(document.refCount)  
    totalRef += data; 
    childDocs.push({
      contact: document.contact,
      children: await getChildren(document.contact),
    });
  }
  
  
  return childDocs;
}

const rootContactNumber = contact;

const data = await getChildren(rootContactNumber)
// console.log("data",data);

res.json({totalRef ,level})

}

    