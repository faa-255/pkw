const router = require('express').Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. ลงทะเบียนและเข้าสู่ระบบ
router.post('/register', upload.single('avatar'), authController.register);
router.post('/login', authController.login);

// 2. ดูสถิติ (สำหรับ Admin Dashboard)
router.get('/stats', verifyToken, authController.getUserStats);

// 3. จัดการผู้ใช้งาน (Admin Manage)
// ✅ อันนี้คุณมีแล้ว (สำหรับหน้ารายชื่อรวม)
router.get('/users', verifyToken, authController.getAllUsers);

// ❌❌❌ อันนี้คือส่วนที่ขาดไป ต้องเติมครับ! ❌❌❌
router.get('/users/:id', verifyToken, authController.getUserById);       // ดึงข้อมูลรายคน (แก้ Error หน้า Edit)
router.put('/users/:id', verifyToken, upload.single('avatar'), authController.updateUser); // บันทึกแก้ไข
router.delete('/users/:id', verifyToken, authController.deleteUser);     // ลบผู้ใช้

module.exports = router;