const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../.env'});

module.exports.verifyUser = async function(req, res, next){

try {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
      }

    const secret = process.env.SECRET_KEY;
    try {
        const data = jwt.verify(token , secret)
        req.user = data;
        module.exports.data = data;
               
    } catch (error) {
        res.status(404).json('Invalid token')
    }
    return next();
} catch (error) {
    res.status(500).json('Something went wrong in updating user')
}

    
}
