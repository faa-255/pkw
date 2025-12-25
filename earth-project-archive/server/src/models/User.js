const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // ✅ กำหนด Role เป็น student หรือ teacher
    role: { 
        type: String, 
        enum: ['student', 'teacher'], 
        default: 'student' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);