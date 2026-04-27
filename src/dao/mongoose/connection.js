const mongoose = require("mongoose");
module.exports = {
    connect_mongoose: async () => {
        const mongoose = require('mongoose');

        mongoose.set("strictQuery", true);

        mongoose.connection.once("open", () => {
            console.log("Connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Error connecting to MongoDB", err);
        })

        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                autoIndex: true,
                maxPoolSize: 10
            });
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
}