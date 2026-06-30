const User = require('../models/User');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'admin' })
      .populate('assignedDomes', 'name city type status')
      .select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, assignedDomes } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Semua field wajib diisi.');
    }

    const userRole = 'admin';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409);
      throw new Error('Email sudah terdaftar.');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      assignedDomes: assignedDomes || [],
    });

    await user.populate('assignedDomes', 'name city type status');

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedDomes: user.assignedDomes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, assignedDomes } = req.body;

    let updateData = { name, email };
    if (role && role !== 'user') {
      updateData.role = role;
    }
    if (assignedDomes !== undefined) {
      updateData.assignedDomes = assignedDomes;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('assignedDomes', 'name city type status')
      .select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User tidak ditemukan.');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User tidak ditemukan.');
    }

    res.json({ success: true, message: 'User berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

const getPromotionUsers = async (req, res, next) => {
  try {
    let users = await User.find({ role: 'user' }).select('-password');
    
    if (users.length === 0) {
      users = [
        { _id: 'dummy-1', name: 'Budi Santoso', email: 'budi@example.com', createdAt: new Date() },
        { _id: 'dummy-2', name: 'Siti Aminah', email: 'siti@example.com', createdAt: new Date() },
        { _id: 'dummy-3', name: 'Andi Wijaya', email: 'andi@example.com', createdAt: new Date() },
        { _id: 'dummy-4', name: 'Rina Kartika', email: 'rina@example.com', createdAt: new Date() },
        { _id: 'dummy-5', name: 'Dewi Lestari', email: 'dewi@example.com', createdAt: new Date() }
      ];
    }
    
    const usersWithStats = users.map(user => {
      const rand = () => Math.floor(Math.random() * 11);
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        stats: {
          designHemisphere: rand(),
          designSemiEllipsoid: rand(),
          designCustom: rand(),
          wasteCalculator: rand()
        }
      };
    });

    res.json({ success: true, count: usersWithStats.length, data: usersWithStats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getPromotionUsers
};
