const Project = require('../../models/Project');
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.getAllProjects = async function(req, res){
    try {
        logger.info(successMessages.START);
        logger.info(successMessages.GET_ALL_PROJECT_ACTIVATED)
        const contact =  req.headers['contact'];
    var projectData;
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    if(contact){
        //check for projects in DB
        try {
            const countData = await Project.find({contact});
            const count = countData.length;

            projectData = await Project.find({contact})
            .skip((page - 1) * limit)
            .limit(limit);

           
           //check for record found or not
           if(projectData.length == 0){
               logger.error(errorMessages.NOT_FOUND)
               return res.status(404).json(errorMessages.NOT_FOUND);
           }else{
               logger.info(`Output - ${successMessages.DATA_SEND_SUCCESSFULLY}`)
               logger.info(successMessages.END);
               //reponse
               return res.status(200).json({
                page,
                totalPages: Math.ceil(count / limit),
                projectData
            });
           }
       } catch (error) {
           logger.error(error);
           return res.status(502).json(errorMessages.BAD_GATEWAY)
       }
      }else{
                //check for projects in DB
                try {
                    projectData = await Project.find()
                    .skip((page - 1) * limit)
                    .limit(limit);

                    const count = await Project.countDocuments();
                    console.log("count",count);
                   //check for record found or not
                   if(projectData.length == 0){
                       logger.error(errorMessages.NOT_FOUND)
                       return res.status(404).json(errorMessages.NOT_FOUND);
                   }else{
                       logger.info(`Output - ${successMessages.DATA_SEND_SUCCESSFULLY}`)
                       logger.info(successMessages.END);
                       //reponse
                       return res.status(200).json({
                        page,
                        totalPages: Math.ceil(count / limit),
                        projectData
                       });
                   }
               } catch (error) {
                   logger.error(error);
                   return res.status(502).json(errorMessages.BAD_GATEWAY)
               }
      }

        
    } catch (error) {
        logger.error(errorMessages.GET_ALL_PROJECT_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
}