const User =  require('../../models/User');
const Project = require('../../models/Project');
const History = require('../../models/History');

module.exports.dashboard = async function(req , res){

    const Data = [];
    //check total Active users
    const totalIBE = await User.countDocuments();

    //push Data into object
    Data.push({key:'totalIBE',value:totalIBE})

    //check total Active users
    const activeIBE = await User.countDocuments({userStatus:'Active'})
    
    //push Data into object
    Data.push({key:'ActiveIBE',value:activeIBE})

    //check total Inactive users
    const inActiveIBE = await User.countDocuments({userStatus:'Inactive'})

    //push Data into object
    Data.push({key:'InactiveIBE',value:inActiveIBE})

    const sanctionedFund = {
        'projectStatus': 'Completed' // Replace with the actual field for user contact number
      };

    const totalSantionedFund = await Project.aggregate([
        {$match: sanctionedFund},
        {$group:{ _id: null, totalAmount: { $sum: '$sanctionedAmount' } }}
      ])
    //push Data into object
    Data.push({key:'CompletedFund',value:totalSantionedFund})

      const pendingFund = {
        'projectStatus': 'Approved' // Replace with the actual field for user contact number
      };
      const totalPendingFund = await Project.aggregate([
        {$match: pendingFund},
        {$group:{ _id: null, totalAmount: { $sum: '$sanctionedAmount' } }}
      ])  
    //push Data into object
    Data.push({key:'PendingFund',value:totalPendingFund})

    const totalFund = totalSantionedFund[0].totalAmount + totalPendingFund[0].totalAmount;
   
    //push Data into object
    Data.push({key:'TotalFund',value:totalFund});


    //Total commision Amount
    const comissionAmount = {
        'projectStatus': 'Completed' // Replace with the actual field for user contact number
      };

    const totalCompletedComission = await Project.aggregate([
        {$match: comissionAmount},
        {$group:{ _id: null, totalAmount: { $sum: '$comissionAmount' } }}
      ])

        //push Data into object
        Data.push({key:'CompletedCommision',value:totalCompletedComission});

      const pendngComissionAmount = {
        'projectStatus': 'Approved' // Replace with the actual field for user contact number
      };

    const totalPendingComission = await Project.aggregate([
        {$match: pendngComissionAmount},
        {$group:{ _id: null, totalAmount: { $sum: '$comissionAmount' } }}
      ])

    //push Data into object
    Data.push({key:'PendingCommision',value:totalPendingComission});

    const totalCommision = totalCompletedComission[0].totalAmount + totalPendingComission[0].totalAmount;
   
    //push Data into object
    Data.push({key:'TotalCommision',value:totalCommision});
    //End of commision Amount

    //Total  Referral Amount

    const completedReferral = {
        'origin':'Referral',
        'status': 'Completed' // Replace with the actual field for user contact number
      };

    const completedReferralEarning = await History.aggregate([
        {$match: completedReferral},
        {$group:{ _id: null, totalAmount: { $sum: '$transactionAmount' } }}
      ])

        //push Data into object
        Data.push({key:'CompletedReferral',value:completedReferralEarning});

      const pendingReferral = {
        'origin':'Referral',
        'status': 'Pending' // Replace with the actual field for user contact number
      };

    const pendingReferralEarning = await History.aggregate([
        {$match: pendingReferral},
        {$group:{ _id: null, totalAmount: { $sum: '$transactionAmount' } }}
      ])

    //push Data into object
    Data.push({key:'PendingReferral',value:pendingReferralEarning});
    console.log("Referral",completedReferralEarning , pendingReferralEarning);
    //const totalReferral = completedReferralEarning[0].totalAmount + pendingReferralEarning[0].totalAmount;
   
    //push Data into object
    //Data.push({key:'TotalReferral',value:totalReferral});

    //end of total referral amount

    console.log(Data);
    res.json(Data)
}