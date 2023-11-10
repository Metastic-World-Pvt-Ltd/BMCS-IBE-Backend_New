const mongoose =  require('mongoose');

const bannerSchema =  new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    imageURL:{
        type:String,
        required:true,
    },
    bannerType:{
        type:String,
        required:true
    },
    hidden:{
        type:String,
        required:true,
    },
},{
    timestamps:true
})

module.exports = mongoose.model('HomeBanner', bannerSchema);