const mongoose = require("mongoose");

const connectDB = async () => {
await mongoose.connect(
    //"mongodb+srv://namastetanush:yeRNokl3BlM7tcnu@namastenode.qikrg8y.mongodb.net/devTinder"
    "mongodb+srv://namastetanush:yeRNokl3BlM7tcnu@namastenode.qikrg8y.mongodb.net/?retryWrites=true&w=majority&appName=Namastenode"
);
};

module.exports = connectDB;

