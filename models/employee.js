const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
    
const employeeSchema = new Schema({
   name: {type: String, required: true},
   phone: String
});

const Employee = module.exports = mongoose.model("Employee", employeeSchema);
