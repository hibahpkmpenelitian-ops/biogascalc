const mongoose = require('mongoose');

const domeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama lokasi wajib diisi'],
      trim: true,
      maxlength: [200, 'Nama maksimal 200 karakter'],
    },
    city: {
      type: String,
      required: [true, 'Kota wajib diisi'],
      trim: true,
      maxlength: [150, 'Kota maksimal 150 karakter'],
    },
    lat: {
      type: Number,
      required: [true, 'Latitude wajib diisi'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude wajib diisi'],
    },
    type: {
      type: String,
      enum: ['Peternakan', 'Perkebunan', 'Industri', 'Komunitas'],
      required: [true, 'Tipe wajib diisi'],
    },
    limbahPerHari: {
      type: Number,
      default: 0,
      min: [0, 'Limbah per hari tidak boleh negatif'],
    },
    potensiGas: {
      type: Number,
      default: 0,
      min: [0, 'Potensi gas tidak boleh negatif'],
    },
    diameter: {
      type: Number,
      default: 0,
      min: [0, 'Diameter tidak boleh negatif'],
    },
    tinggi: {
      type: Number,
      default: 0,
      min: [0, 'Tinggi tidak boleh negatif'],
    },
    status: {
      type: String,
      enum: ['Aktif', 'Potensi'],
      default: 'Potensi',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dome', domeSchema);
