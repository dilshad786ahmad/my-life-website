const mongoose =require("mongoose")


const mongodb_url=process.env.MONGODB_URI
const mongodbConnet=async()=>{
    try {
        await mongoose.connect(mongodb_url);
        console.log('mongo db database is conneted')

    } catch (error) {
        console.log("mongodb databse crashed" , error)
    }
}

module.exports=mongodbConnet