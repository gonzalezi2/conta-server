const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Project = require('../models/project');

// Schema setup
const companySchema = new Schema({
    name: {type: String, required: true},
    address: String,
    contact: String,
    email: String,
    phone: Number,
    website: String,
    isActive: Boolean,
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }    
    ]
}, { usePushEach: true });

const Company = module.exports = mongoose.model('Company', companySchema);