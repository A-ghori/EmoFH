const mongoose = require ('mongoose');

const connectDB = async () => {
    try{
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/emofh';

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true, //Index creation enable
            connectTimeoutMS: 10000, //10 sec timeout 
            maxPoolSize:500 //allow many connections for high traffic
        });
        console.log(`MongoDB connected on : ${mongoURI}`);

    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

 module.exports = connectDB