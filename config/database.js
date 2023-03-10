const mongoose = require('mongoose');
const {MONGO_URI} = process.env
exports.connect=()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_URI,)
    .then(()=>{
        console.log('Successfully connect database')
    })
    .catch((error)=>{
        console.log('Error connecting database');
        console.log(error);
        process.exit(1);

    })
}