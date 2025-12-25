const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ตรวจสอบกับสร้างโฟลเดอร์อัพอัตโนมัติ
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        //อันนี้ป้องกันชื่อซ้ำกัน
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('รองรับเฉพาะไฟล์ PDF และรูปภาพเท่านั้น'), false);
    }
};

module.exports = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 } //จำกัดขนาดไฟล10MB
});