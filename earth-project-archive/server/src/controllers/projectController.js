const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

// 1. เพิ่มโครงงาน
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
            title, description, category, year, file: fileData, owner: req.user.id
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// ✅ 2. ดูข้อมูลทั้งหมด (แก้ไขให้รองรับ userId)
exports.getAllProjects = async (req, res) => {
    try {
        // รับค่า userId เพิ่มเข้ามา
        const { search, category, userId } = req.query; 
        let query = {};

        if (search) query.title = { $regex: search, $options: 'i' };
        if (category) query.category = category;
        
        // ✅ ถ้ามี userId ส่งมา ให้กรองเฉพาะเจ้าของคนนั้น
        if (userId) query.owner = userId;

        const projects = await Project.find(query)
            .populate('owner', 'name username role profileImage') 
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

// 3. ดูข้อมูลรายตัว
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name username role profileImage');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. แก้ไขข้อมูล
exports.updateProject = async (req, res) => {
    try {
        const { title, description, category, year } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'ไม่พบโครงงาน' });

        if (req.user.role !== 'admin' && project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไข' });
        }

        let updateData = { title, description, category, year };
        if (req.file) {
            if (project.file && project.file.filePath) {
                 fs.unlink(project.file.filePath, (err) => { if (err) console.error(err); });
            }
            updateData.file = {
                fileName: req.file.filename,
                filePath: req.file.path,
                fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
                fileType: req.file.mimetype
            };
        }
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'แก้ไขไม่สำเร็จ', error: error.message });
    }
};

// 5. ดูสถิติ
exports.getProjectStats = async (req, res) => {
    try {
        const stats = await Project.aggregate([ { $group: { _id: "$category", count: { $sum: 1 } } } ]);
        const statsObject = stats.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {});
        res.json(statsObject);
    } catch (error) {
        res.status(500).json({ message: 'Error stats' });
    }
};

// 6. ลบข้อมูล
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (req.user.role !== 'admin') {
            if (req.user.role === 'teacher') return res.status(403).json({ message: 'อาจารย์ลบไม่ได้' });
            if (project.owner.toString() !== req.user.id) return res.status(403).json({ message: 'ลบได้เฉพาะงานตัวเอง' });
        }

        if (project.file && project.file.filePath) {
            fs.unlink(project.file.filePath, (err) => { if (err) console.error(err); });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting' });
    }
};