const ProductList =  require('../../models/ProductList');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.deletePorductList = async function(req , res){
    logger.info(successMessages.START);
    
    const {productName} = req.body;
}