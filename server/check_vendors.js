import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Vendor from './models/Vendor.js';

dotenv.config();

const checkVendors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const vendorUsers = await User.find({ role: 'vendor' }).select('name email');
    console.log('\nUsers with VENDOR role:');
    console.table(vendorUsers.map(u => ({ id: u._id.toString(), name: u.name, email: u.email })));

    const vendors = await Vendor.find().populate('user', 'name email');
    console.log('\nRecords in Vendor collection:');
    console.table(vendors.map(v => ({ 
      id: v._id.toString(), 
      storeName: v.storeName, 
      user: v.user?.email || 'N/A',
      isApproved: v.isApproved 
    })));

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkVendors();
