const Kyc = require('../../models/Kyc');
const VideoKYC =  require('../../models/VideoKYC');
const errorMessages = require('../../response/errorMessages');

module.exports.checkKycStatus = async function(req, res){
try {
    const empId = req.headers['id'];

    if(!empId){
        return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED);
    }

    try {
        const kycData =  await Kyc.findOne({empId});

        var isKyc, kycStatus ,isVideo ,videoStatus;
        if(kycData){
             kycStatus = kycData.status;
             isKyc = 'true';
        }else{
            kycStatus = 'Not Initiated';
            isKyc = 'false';
            return res.status(404).json({kycStatus,isKyc})
        }
        const videoData = await VideoKYC.findOne({empId})
    
        if(videoData){
            videoStatus = videoData.status;
            isVideo = 'true';
        }else{
            videoStatus = 'Not Initiated';
            isVideo = 'false';
        }
         
        
        return res.status(200).json({kycStatus, isKyc , videoStatus ,isVideo});
    } catch (error) {
        return res.status(502).json(errorMessages.BAD_GATEWAY)
    }
} catch (error) {
    return res.status(502).json(errorMessages.INTERNAL_ERROR)
}
}