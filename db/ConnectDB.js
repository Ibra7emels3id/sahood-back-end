const mongoose = require('mongoose')

const connectDB = async () => {
    // Connect to MongoDB
    try {
        await mongoose.connect('mongodb://ibra7emdev_db_user:3COO7Zg2bOYjFGL5@ac-ngzxrtf-shard-00-00.5nxssj0.mongodb.net:27017,ac-ngzxrtf-shard-00-01.5nxssj0.mongodb.net:27017,ac-ngzxrtf-shard-00-02.5nxssj0.mongodb.net:27017/?ssl=true&replicaSet=atlas-l9li3s-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
        console.log("connected to MongoDB");
    } catch (error) {
        console.log("ERROR WITH CONNECTING  MongoDB", error);
    }
}


module.exports = connectDB;

