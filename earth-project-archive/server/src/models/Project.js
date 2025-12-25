const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    category: { 
        type: String, 
        required: true 
    },
    year: { 
        type: Number 
    },
    students: { 
        type: String 
    }, // เก็บรายชื่อผู้จัดทำ
    
    // เก็บข้อมูลไฟล์แบบ Object เพื่อความละเอียด
    file: {
        fileName: String,
        filePath: String,
        fileUrl: String,
        fileType: String
    },
    
    // เชื่อมโยงว่าใครเป็นคนโพสต์ (User ID)
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);