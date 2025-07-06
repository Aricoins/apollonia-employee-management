const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del departamento es requerido'],
    unique: true,
    trim: true,
    enum: [
      'General Dentistry',
      'Pediatric Dentistry', 
      'Restorative Dentistry',
      'Surgery',
      'Orthodontics'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', departmentSchema);