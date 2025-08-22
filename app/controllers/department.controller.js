const mongoose = require('mongoose');
const Department = require('../models/department.model');
const Employee = require('../models/employee.model');

// Crear departamento
exports.create = async (req, res) => {
  try {
    console.log('Creando departamento:', req.body);
    
    const department = new Department({
      name: req.body.name,
      description: req.body.description
    });
    
    const savedDepartment = await department.save();
    console.log('Departamento creado:', savedDepartment);
    
    res.status(201).json({
      success: true,
      message: 'Departamento creado exitosamente',
      data: savedDepartment
    });
  } catch (error) {
    console.error('Error creando departamento:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear departamento'
    });
  }
};

// Obtener todos los departamentos
exports.findAll = async (req, res) => {
  try {
    console.log('Obteniendo todos los departamentos...');
    
    // Obtener parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Obtener el total de departamentos
    const totalDepartments = await Department.countDocuments();
    
    // Obtener departamentos con paginación
    const departments = await Department.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    console.log(`Encontrados ${departments.length} departamentos de ${totalDepartments} total`);
    
    res.status(200).json({
      success: true,
      count: departments.length,
      total: totalDepartments,
      currentPage: page,
      totalPages: Math.ceil(totalDepartments / limit),
      hasNextPage: page < Math.ceil(totalDepartments / limit),
      hasPrevPage: page > 1,
      data: departments
    });
  } catch (error) {
    // LOG DETALLADO PARA DEBUG EN PRODUCCIÓN
    console.error('Error obteniendo departamentos:', error);
    if (error instanceof mongoose.Error) {
      console.error('Mongoose error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener departamentos',
      error: error.stack || error
    });
  }
};

// Obtener departamento por ID
exports.findOne = async (req, res) => {
  try {
    console.log('Buscando departamento con ID:', req.params.id);
    
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    console.log('Departamento encontrado:', department);
    
    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error buscando departamento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al buscar departamento'
    });
  }
};

// Actualizar departamento
exports.update = async (req, res) => {
  try {
    console.log('Actualizando departamento:', req.params.id, req.body);
    
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    console.log('Departamento actualizado:', department);
    
    res.status(200).json({
      success: true,
      message: 'Departamento actualizado exitosamente',
      data: department
    });
  } catch (error) {
    console.error('Error actualizando departamento:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar departamento'
    });
  }
};

// Eliminar departamento
exports.delete = async (req, res) => {
  try {
    console.log('Eliminando departamento:', req.params.id);
    
    // Verificar si hay empleados asignados
    const employeeCount = await Employee.countDocuments({ department: req.params.id });
    if (employeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el departamento. Tiene ${employeeCount} empleados asignados.`
      });
    }
    
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    console.log('Departamento eliminado:', department);
    
    res.status(200).json({
      success: true,
      message: 'Departamento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando departamento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar departamento'
    });
  }
};

// Obtener empleados de un departamento
exports.getEmployees = async (req, res) => {
  try {
    console.log('Obteniendo empleados del departamento:', req.params.id);
    
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    const employees = await Employee.find({ department: req.params.id })
      .populate('department', 'name description')
      .sort({ lastName: 1, firstName: 1 });
    
    res.status(200).json({
      success: true,
      department: department,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error obteniendo empleados del departamento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener empleados'
    });
  }
};