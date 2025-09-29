const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-guidance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@platform.com' });
    
    if (!existingAdmin) {
      // Create admin user
      const admin = new User({
        name: 'Platform Administrator',
        email: 'admin@platform.com',
        password: 'admin123',
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Check if demo student exists
    const existingStudent = await User.findOne({ email: 'demo@student.com' });
    
    if (!existingStudent) {
      // Create demo student user
      const demoStudent = new User({
        name: 'Demo Student',
        email: 'demo@student.com',
        password: 'demo123',
        role: 'student'
      });

      await demoStudent.save();
      console.log('✅ Demo student user created successfully');
    } else {
      console.log('✅ Demo student user already exists');
    }
    
    console.log('');
    console.log('🔑 Default Credentials:');
    console.log('');
    console.log('Admin Account:');
    console.log('📧 Email: admin@platform.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('Demo Student Account:');
    console.log('📧 Email: demo@student.com');
    console.log('🔑 Password: demo123');
    console.log('');
    console.log('⚠️  Please change passwords after first login in production!');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
