const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // ✅ กำหนด Role เป็น student หรือ teacher
    role: { 
        type: String, 
        enum: ['student', 'teacher','admin'], 
        default: 'student' 
    },
    // ✅ เพิ่มเก็บรูปโปรไฟล์
    profileImage: {
        type: String,
        default: '' // ถ้าไม่ใส่จะเป็นค่าว่าง
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);