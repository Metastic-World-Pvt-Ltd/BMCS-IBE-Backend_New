const multer = require('multer');
module.exports.storage = function(req, res){

        // Handle successful file upload
       // res.status(200).json('File uploaded successfully');
    const storageValue = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'D:/data/uploads');
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix);
        }
      });
      
      const fileFilterValue = (req,res, file) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      
        if (allowedMimeTypes.includes(file.mimetype)) {
          console.log("upload success");
        } else {
          //cb(new Error('Invalid file type'));
          res.status(400).json('Invalid file type');
        }
      };
      //file limit
      const limitValue = (req, res)=>{
        try {
            { fileSize: 1 * 1024 * 1024 }
        } catch (error) {
            res.status(400).json('File size is more than 1MB')
        }
      }
  module.exports ={
    storageValue,
    fileFilterValue,
    limitValue,
  }


}
 
