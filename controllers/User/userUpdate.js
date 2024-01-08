const User = require('../../models/User');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

module.exports.userUpdate = async function (req, res) {
    try {
        logger.info(`Start`);
        logger.info(successMessages.USER_UPDATED_ACTIVATED)
        logger.info(`Input - ${req.body}`)
        const empId = req.headers['id'];
        //check for Body input
        if (!req.body) {
            res.status(400).json(errorMessages.INVALID_INPUT)
        }


        const updateData = await User.findOneAndUpdate({ empId }, req.body, { new: true });
        if (updateData) {
            //response 
            logger.info(`updated output - ${updateData}`)
            logger.info(`End`);
            return res.status(200).json(updateData);
        } else {
            logger.error(errorMessages.USER_DOES_NOT_EXIST)
            return res.status(404).json(errorMessages.USER_DOES_NOT_EXIST)
        }

        //handel API error 
    } catch (error) {
        logger.error(errorMessages.USER_UPDATE_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
}