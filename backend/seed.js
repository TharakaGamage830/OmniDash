require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Category = require('./models/Category');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Seed Admin
        const existingAdmin = await Admin.findOne({ email: 'admin@anutouch.com' });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
            await Admin.create({
                fullName: 'Tharaka Ashen',
                email: 'admin@anutouch.com',
                password: hashedPassword,
                whatsappNumber: '94762310156',
                isSuperAdmin: true
            });
            console.log('Initial Admin created!');
        }

        // Seed initial categories if none exist
        const catCount = await Category.countDocuments();
        if (catCount === 0) {
            const initialCats = [
                { name: 'Key Tags', prefix: 'KEY', description: 'Handmade key tags' },
                { name: 'Hair Clips', prefix: 'HAR', description: 'Cute hair accessories' },
                { name: 'Flower Bouquets', prefix: 'FLW', description: 'Gift bouquets' },
                { name: 'Bag Items', prefix: 'BAG', description: 'Assessories for bags' },
                { name: 'Clear Bags', prefix: 'CLR', description: 'Transparent stylish bags' },
                { name: 'Pencil Case', prefix: 'PEN', description: 'Stationary storage' },
                { name: 'Birthday Cards', prefix: 'CRD', description: 'Custom cards' }
            ];
            await Category.insertMany(initialCats);
            console.log('Initial Categories seeded!');
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
