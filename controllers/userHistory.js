const History = require('../models/History');

module.exports.userHistory = async  function(req, res){
try {
    //input data of user
    const contact = req.body.contact || req.query.contact || req.headers["contact"];
    if(!contact){
        res.status(400).json('Please provide contact')
    }else{
        const userHist = await History.find({contact});
        if(userHist.length == 0){
            res.status(404).json('No record found')
        }else{
            res.status(200).json(userHist);
        }
    }
} catch (error) {
    res.status(500).json('Something went wrong in fetching user transaction History')
}

}