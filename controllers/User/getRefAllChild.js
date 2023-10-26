const User = require('../../models/User');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const logger = require('./logger');

module.exports.getRefAllChild = async function(req, res){
// try {
    logger.info(`Start`);
    logger.info(successMessages.GET_REF_CHILD_ACTIVATED);
    //define array to store referral
    const stack = [];
    const levelCount1 = [];
    const levelCount2 = [];
    const levelCount3 = [];
    //user Input
    const userContact = req.headers['contact'];
    logger.info(`Input - ${userContact}`);
    console.log(userContact);
    //check contact provided or not
    if(!userContact){
        logger.error(`Error - ${errorMessages.CONTACT_IS_REQUIRED}`);
        return res.status(400).json(errorMessages.CONTACT_IS_REQUIRED);
    }


const yourContactNumber = 'YourContactNumber';

// Define a function to recursively find users referred by a specific contact number
async function findUsersReferredByContactNumber(contact) {
  const referredUsers = await User.find({ refBy: contact });
  console.log("referredUsers",referredUsers);
//   for (const user of referredUsers) {
//     const directReferrals = await findUsersReferredByContactNumber(user.contact);
//     user.directReferrals = directReferrals;
//   }
//   console.log("Main Result",referredUsers);
//   return referredUsers;
    
}

const data = findUsersReferredByContactNumber(userContact);

res.json(data);
}