const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. ลงทะเบียน
exports.register = async (req, res) => {
    try {
        const { username, password, name, role } = req.body;

        // เช็คชื่อซ้ำ
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'ชื่อผู้ใช้งานนี้มีแล้ว' });

        // เข้ารหัสรหัสผ่าน
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // จัดการรูปโปรไฟล์
        let profileImageUrl = '';
        if (req.file) {
            profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const newUser = await User.create({
            username,
            password: hashedPassword,
            name,
            role: role || 'student',
            profileImage: profileImageUrl
        });

        res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering', error: error.message });
    }
};

// 2. เข้าสู่ระบบ
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้งาน' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านผิด' });

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'secret_key_earth_tone',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 3. ดูสถิติ (Admin Dashboard)
exports.getUserStats = async (req, res) => {
    try {
        const stats = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);
        
        const result = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

// ✅ 4. ดึงรายชื่อทั้งหมด (Admin Manage)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// ✅ 5. ดึงข้อมูลรายคน (Admin Edit) - *ตัวที่ทำให้ Error*
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

// ✅ 6. อัปเดตข้อมูลผู้ใช้ (Admin Update)
exports.updateUser = async (req, res) => {
    try {
        const { name, username, role, password } = req.body;
        let updateData = { name, username, role };

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        if (req.file) {
            updateData.profileImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
};

// ✅ 7. ลบผู้ใช้ (Admin Delete)
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};