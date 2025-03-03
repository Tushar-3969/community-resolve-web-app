const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    reportDate: { type: Date, required: true },
    department: { type: String, required: true },
    subTopic: { type: String, required: false },
    photograph: { type: String, required: false },
    firstName: { type: String, required: true, match: /^[A-Za-z]+$/ },
    lastName: { type: String, required: true, match: /^[A-Za-z]+$/ },
    email: { type: String, required: false, match: /.+\@.+\..+/ },
    phoneNumber: { type: String, required: true, match: /^\d{10}$/ },
    District: { type: String, required: true, match: /^[A-Za-z]+$/ },
    address1: { type: String, required: false },
    address2: { type: String, required: false },
    city: { type: String, required: true, match: /^[A-Za-z]+$/ },
    state: { type: String, required: true, match: /^[A-Za-z]+$/ },
    zipcode: { type: String, required: true, match: /^[0-9]+$/ },
    comment: { type: String, required: false },
    status: { type: String, default: 'Pending' }, // Add default status
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;