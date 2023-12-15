const errorMessages = require('../../../response/errorMessages');
const successMessages = require('../../../response/successMessages');
require('dotenv').config({ path: '../../../.env' });
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const logger = require('../../User/logger');
const AdminUser = require('../../../models/AdminUser');
const Kyc = require('../../../models/Kyc');

module.exports.rejectedKyc = async function (req, res) {
    try {

        //user input
        var token = req.body.token || req.query.token || req.headers["x-access-token"];
        //check for valid response
        if (!token) {
            return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
        }
        var userRole;
        try {
            //decode token signature
            const secret = process.env.SECRET_KEY;
            // Decrypt
            var bytes = CryptoJS.AES.decrypt(token, secret);
            token = bytes.toString(CryptoJS.enc.Utf8);
            const decode = jwt.verify(token, secret);

            //check for user role as per token
            userRole = decode.role;
            var id = decode.id
            var userEmail = decode.email;
        } catch (error) {
            return res.status(401).json(errorMessages.TOKEN_EXPIRED)
        }
        //check Admin user is active or not
        try {
            var activeUser = await AdminUser.findById({ _id: id })
            // console.log("activeUser",activeUser);
            if (activeUser == null) {
                logger.error(`In active Admin`)
                return res.status(401).json(errorMessages.ACCESS_DENIED)
            }
        } catch (error) {
            logger.error(errorMessages.SOMETHING_WENT_WRONG)
            return res.status(502).json(errorMessages.SOMETHING_WENT_WRONG)
        }


        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 8;

            const filteredItems = await Kyc.find({ rejectedBy: userEmail });
            const totalFilteredItems = filteredItems.length;
            // Use Mongoose to find paginated items
            const paginatedItems = await Kyc.find({ rejectedBy: userEmail })
                .skip((page - 1) * limit)
                .limit(limit);

            // Send the paginated items as the API response
            return res.status(200).json({
                page,
                totalPages: Math.ceil(totalFilteredItems / limit),
                Kyc: paginatedItems,
            });
        } catch (error) {
            return res.status(502).json(errorMessages.BAD_GATEWAY);
        }
    } catch (error) {
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
}
