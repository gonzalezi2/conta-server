const mongoose = require("mongoose"),
    Employee = require('./employee'),
    Schema  = mongoose.Schema;
    
const timesheetSchema = new Schema({
    date: Date,
    hours: [
        { 
            employee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee"
            },
            wed: Number,
            wed_ot: Number,
            thurs: Number,
            thurs_ot: Number,
            fri: Number,
            fri_ot: Number,
            sat: Number,
            sat_ot: Number,
            sun: Number,
            sun_ot: Number,
            mon: Number,
            mon_ot: Number,
            tues: Number,
            tues_ot: Number,
            rate: {type: Number, required: true},
            rate_ot: {type: Number, required: true},
            reg_hrs: Number,
            ot_hrs: Number,
            tot_cost: Number
        }
    ],
    tot_hrs: Number,
    tot_ot: Number,
    tot_cost: Number
});

const Timesheet = module.exports = mongoose.model("Timesheet", timesheetSchema);