const mongoose = require('mongoose');
const { Schema } = mongoose;

const PendingValidationSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true},
    expiration: { type: Date, required: true },
    code: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PendingValidation', PendingValidationSchema);
