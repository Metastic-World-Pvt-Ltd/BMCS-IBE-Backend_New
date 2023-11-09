const { findOne } = require('../../models/AdminUser');
const ProductList = require('../../models/ProductList');
const successMessages = require('../../response/successMessages');
const logger = require('../User/logger');

module.exports.editSubCategory = async function(req , res){
try {
    logger.info(successMessages.START);
    logger.info(successMessages.EDIT_SUB_CATEGORY_ACTIVATED
        )
    const {oldName , newName } = req.body;
    logger.info(`Input - oldName-${oldName}, newName -${newName} `)

    try {
        const updateName = await ProductList.updateMany(
            { productName: oldName },
            { $set: {  productName: newName,} },
            {new:true}
          );
    
        const updateCategory = await ProductList.updateMany(
            { category: oldName },
            { $set: {  subCategory: newName,} },
            {new:true}
          );  
    
          logger.info(successMessages.RECORD_UPDATED_SUCCESSFULLY)
          logger.info(successMessages.END)
          return res.json(successMessages.RECORD_UPDATED_SUCCESSFULLY)
    } catch (error) {
        logger.error(error)
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }


} catch (error) {
    logger.error(errorMessages.EDIT_SUB_CATEGORY_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}

}