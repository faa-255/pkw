const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

// 1. เพิ่มโครงงาน (Create)
exports.createProject = async (req, res) => {
    try {
        const { title, description, category, year } = req.body;
        
        let fileData = {};
        if (req.file) {
            fileData = {
                fileName: req.file.filename,
                filePath: req.file.path,
                fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
                fileType: req.file.mimetype
            };
        }

        const newProject = await Project.create({
            title,
            description,
            category,
            year,
            file: fileData,
            owner: req.user.id // ✅ บันทึก ID คนสร้าง
        });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// 2. ดูข้อมูลทั้งหมด (Read All)
exports.getAllProjects = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) query.title = { $regex: search, $options: 'i' };
        if (category) query.category = category;

        const projects = await Project.find(query)
            .populate('owner', 'name username role') // ✅ ดึงชื่อเจ้าของมาแสดง
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

// ✅ 3. ดูข้อมูลรายตัว (Read One) - *ส่วนที่ขาดไป*
// ฟังก์ชันนี้จำเป็นสำหรับหน้า Edit เพื่อดึงข้อมูลเก่ามาแสดง
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name username role');
            
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. แก้ไขข้อมูล (Update)
exports.updateProject = async (req, res) => {
    try {
        const { title, description, category, year } = req.body;
        const projectId = req.params.id;

        // 1. หาโครงงานก่อน
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'ไม่พบโครงงาน' });

        // 2. เช็คสิทธิ์: ต้องเป็นเจ้าของเท่านั้น (อาจารย์แก้ไขไม่ได้)
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'คุณไม่มีสิทธิ์แก้ไขโครงงานนี้' });
        }

        // 3. เตรียมข้อมูลที่จะแก้
        let updateData = {
            title,
            description,
            category,
            year
        };

        // 4. ถ้ามีการอัปโหลดไฟล์ใหม่ ให้เปลี่ยนข้อมูลไฟล์ด้วย
        if (req.file) {
            // ลบไฟล์เก่าทิ้งเพื่อไม่ให้รก Server
            if (project.file && project.file.filePath) {
                 fs.unlink(project.file.filePath, (err) => {
                    if (err) console.error("Failed to delete old file:", err);
                });
            }

            updateData.file = {
                fileName: req.file.filename,
                filePath: req.file.path,
                fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
                fileType: req.file.mimetype
            };
        }

        // 5. อัปเดตลง Database
        const updatedProject = await Project.findByIdAndUpdate(
            projectId, 
            updateData, 
            { new: true } // ให้ส่งค่าใหม่กลับไปแสดงผล
        );

        res.json(updatedProject);

    } catch (error) {
        res.status(500).json({ message: 'แก้ไขข้อมูลไม่สำเร็จ', error: error.message });
    }
};
exports.getProjectStats = async (req, res) => {
    try {
        const stats = await Project.aggregate([
            {
                $group: {
                    _id: "$category", // จัดกลุ่มตามประเภท
                    count: { $sum: 1 } // นับจำนวน
                }
            }
        ]);
        
        // แปลงข้อมูลให้อยู่ในรูป { "IT": 5, "Science": 2 } เพื่อให้ใช้ง่าย
        const statsObject = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json(statsObject);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// 5. ลบข้อมูล (Delete)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // ✅ กฎ: อาจารย์ (teacher) ห้ามลบ
        if (req.user.role === 'teacher') {
            return res.status(403).json({ message: 'อาจารย์ไม่สามารถลบโครงงานได้' });
        }

        // ✅ กฎ: ต้องเป็นเจ้าของเท่านั้น ถึงลบได้
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'คุณลบได้เฉพาะงานของตัวเองเท่านั้น' });
        }

        // ลบไฟล์
        if (project.file && project.file.filePath) {
            fs.unlink(project.file.filePath, (err) => {
                if (err) console.error("Failed to delete file:", err);
            });
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project' });
    }
};