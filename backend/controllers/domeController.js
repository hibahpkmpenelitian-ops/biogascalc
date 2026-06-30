const Dome = require('../models/Dome');

const getAllDomes = async (req, res, next) => {
  try {
    const domes = await Dome.find().sort({ createdAt: -1 });
    res.json({ success: true, count: domes.length, data: domes });
  } catch (error) {
    next(error);
  }
};
const getManagedDomes = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query = { _id: { $in: req.user.assignedDomes || [] } };
    }
    
    const domes = await Dome.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: domes.length, data: domes });
  } catch (error) {
    next(error);
  }
};

const getDomeById = async (req, res, next) => {
  try {
    const dome = await Dome.findById(req.params.id);
    if (!dome) {
      res.status(404);
      throw new Error('Dome tidak ditemukan.');
    }
    res.json({ success: true, data: dome });
  } catch (error) {
    next(error);
  }
};

const createDome = async (req, res, next) => {
  try {
    const { name, city, lat, lng, type, limbahPerHari, potensiGas, diameter, tinggi, status } = req.body;

    if (!name || !city || lat == null || lng == null || !type) {
      res.status(400);
      throw new Error('Field name, city, lat, lng, dan type wajib diisi.');
    }

    const dome = await Dome.create({
      name, city, lat, lng, type,
      limbahPerHari: limbahPerHari || 0,
      potensiGas: potensiGas || 0,
      diameter: diameter || 0,
      tinggi: tinggi || 0,
      status: status || 'Potensi',
    });

    res.status(201).json({ success: true, data: dome });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      res.status(400);
      return next(new Error(messages.join('. ')));
    }
    next(error);
  }
};

const updateDome = async (req, res, next) => {
  try {
    const dome = await Dome.findById(req.params.id);
    if (!dome) {
      res.status(404);
      throw new Error('Dome tidak ditemukan.');
    }

    const fields = ['name', 'city', 'lat', 'lng', 'type', 'limbahPerHari', 'potensiGas', 'diameter', 'tinggi', 'status'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        dome[field] = req.body[field];
      }
    });

    const updated = await dome.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      res.status(400);
      return next(new Error(messages.join('. ')));
    }
    next(error);
  }
};

const deleteDome = async (req, res, next) => {
  try {
    const dome = await Dome.findById(req.params.id);
    if (!dome) {
      res.status(404);
      throw new Error('Dome tidak ditemukan.');
    }

    await dome.deleteOne();
    res.json({ success: true, message: 'Dome berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDomes, getManagedDomes, getDomeById, createDome, updateDome, deleteDome };
