const mongoose = require("mongoose");

var url = "mongodb://localhost:27017/Ecommerce"

const db = () => {
  mongoose.connect(url)
    console.log(`MongoDB connected with server `);
 
};

module.exports = db;
