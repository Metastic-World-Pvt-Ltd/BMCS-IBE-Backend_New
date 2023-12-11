const DistributionList = require('../../models/DistributionList');
const errorMessages = require('../../response/errorMessages');

module.exports.getDistributionList = async function(req , res){
    const dl_Id = req.headers['id'];

    if(!dl_Id){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
    }

    const data = await DistributionList.findOne({dl_Id});

    const extractNumbers = (obj) => {
        const result = [];
    
        const extract = (value) => {
            if (typeof value === 'number') {
                result.push(value);
            } else if (typeof value === 'object' && value !== null) {
                Object.values(value).forEach(extract);
            }
        };
    
        Object.values(obj).forEach(extract);
    
        return result;
    };
    
    const numbersOnly = extractNumbers(data);
    numbersOnly.pop();

    
  
    res.json(data);
}