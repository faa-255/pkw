const router = require('express').Router();
const projectController = require('../controllers/projectController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, projectController.getAllProjects);
router.get('/stats', verifyToken, projectController.getProjectStats);
router.get('/:id', verifyToken, projectController.getProjectById);
router.post('/', verifyToken, upload.single('file'), projectController.createProject);
router.put('/:id', verifyToken, upload.single('file'), projectController.updateProject);
router.delete('/:id', verifyToken, projectController.deleteProject);

module.exports = router;