const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const projectSchema = new Schema({
    location: String,
    contract: Number,
    balance: Number,
    totalBalance: Number,
    income: [
       {
            date: Date,
            check: String,
            amount: Number,
            description: String
       }
    ],
    timesheets: [
        {
            type: Schema.Types.ObjectId,
            ref: "Timesheet"
        }
    ],
    expenses: [
        {
            date: Date,
            description: String,
            amount: Number
        }  
    ]
}, { usePushEach: true });

const Project = module.exports = mongoose.model("Project", projectSchema);