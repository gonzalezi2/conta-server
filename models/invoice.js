const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    date: Date,
    ref: String,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    // Use the mongoose increment method to autoincrease this field
    // after every save
    number: 100000,
    lineItems: [{
        description: String,
        contract: Number,
        paid: Number,
        balance: Number
    }]
});