const Project = require('../../models/Project');
const History = require('../../models/History');
const Wallet = require('../../models/Wallet');

module.exports.completeProject = async function(req , res){
    const _id =  req.params.id || req.body.id || req.query.id || req.headers["id"];
    const {projectStatus} = req.body;
    if(!_id){
        return res.status(400).json("Project Id is required")
    }
    if(!projectStatus){
        return res.status(400).json("Project Status is required")
    }
 
    if(projectStatus == "Completed" || projectStatus == "completed"){
        const projectData = await Project.findById({_id});
        console.log(projectData);
        if(projectData ==  null){
            return res.status(404).json("No Records Found");
        }
        if(projectData.projectStatus == "Approved" || projectData.projectStatus == "approved"){
            const completeData = await Project.findByIdAndUpdate({_id},{projectStatus},{new:true})
            const contact = projectData.contact;
            console.log(completeData);
            const withdrawableAmount = parseInt(projectData.sanctionedAmount);

            const lessAMount = await Wallet.findOne({contact});

            const amount = parseInt(lessAMount.projectEarning[0].pendingAmount) - withdrawableAmount; 

            const totalAmount = parseInt(lessAMount.totalEarning) + withdrawableAmount;

            const pendingAmount = await Wallet.findOneAndUpdate({contact},{
                projectEarning:[
                    {
                    pendingAmount:amount,
                    withdrawableAmount:withdrawableAmount,
                    }
                ],
                totalEarning:totalAmount,
            },{new:true})

            console.log("pending amount ",pendingAmount);
            const type = 'credit';
            const origin = 'projectEarning';
            const userHistory = await History.create({
                contact,
                transactionAmount:withdrawableAmount,
                type,
                origin,
            }) 

            console.log("hist",userHistory);
        }else{
            return res.status(401).json(`Unable to perform action as status ${projectData.projectStatus}`)
        }
        return res.send("ok");
    }else{
        return res.status(401).json(`Unable to perform action`)
    }

}