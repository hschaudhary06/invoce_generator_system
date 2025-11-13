const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://hstech025:Jk7vWUj5Bbh7ojQc@stockmanagement.mqqxp.mongodb.net/stock_management?retryWrites=true&w=majority&appName=StockManagement",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("MongoDB Connected!");

        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connection Established');
        });

        mongoose.connection.on('error', () => {
            console.log('MongoDB Connection Error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB Disconnected');
        });
    }
    catch (err) {
        console.error("main error : ",err.message);
        process.exit(1);
    }

};

module.exports = connectDB;