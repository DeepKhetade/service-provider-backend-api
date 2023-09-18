
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,

    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    }

}, { timestamps: true })


const role = mongoose.model("role", roleSchema);

module.exports = role