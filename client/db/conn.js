// const mongoose = require("mongoose");

// const DB = process.env.DATABASE;

// mongoose.connect(DB,{
//     useUnifiedTopology:true,
//     useNewUrlParser:true
// }).then(()=>console.log("connection is successfully done")).catch((error)=>console.log("error" + error.message))

const mongoose = require('mongoose');

// Temporarily hardcode the MongoDB URI
const DB = 'mongodb+srv://namankumar:naman1234@atlascluster.sw6thba.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster';

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => console.log("Connection to MongoDB was successful."))
.catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    console.error("Stack trace:", error.stack);
});
