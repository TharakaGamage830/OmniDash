const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');

// --- Category Management ---
router.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// Admin Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // username is email

    try {
        const admin = await Admin.findOne({ email: username });
        if (admin && (await bcrypt.compare(password, admin.password))) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ token, admin: { fullName: admin.fullName, email: admin.email, profilePic: admin.profilePic } });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Admin Profile
router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

// --- Category Management ---
router.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

router.post('/categories', protect, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.delete('/categories/:id', protect, async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
});

// --- Multi-Admin Management ---
router.get('/list', protect, async (req, res) => {
    const admins = await Admin.find().select('-password');
    res.json(admins);
});

const upload = require('../middleware/uploadMiddleware');

router.post('/add', protect, upload.single('profilePic'), async (req, res) => {
    try {
        const { fullName, email, password, whatsappNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePic = '';
        if (req.file) {
            profilePic = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const admin = await Admin.create({
            fullName,
            email,
            password: hashedPassword,
            whatsappNumber,
            profilePic
        });
        res.status(201).json(admin);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const { fullName, email, password, whatsappNumber } = req.body;

        if (fullName) admin.fullName = fullName;
        if (email) admin.email = email;
        if (whatsappNumber) admin.whatsappNumber = whatsappNumber;

        if (password) {
            admin.password = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            admin.profilePic = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        await admin.save();
        res.json({
            id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            profilePic: admin.profilePic,
            whatsappNumber: admin.whatsappNumber
        });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    if (req.user.id === req.params.id) return res.status(400).json({ message: "Cannot delete yourself" });
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted' });
});

module.exports = router;
