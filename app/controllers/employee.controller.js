const mongoose = require('mongoose');
const Employee = require('../models/employee.model');
const Department = require('../models/department.model');

// Crear empleado
exports.create = async (req, res) => {
  try {
    console.log('Creando empleado:', req.body);
    
    // Verificar que el departamento existe
    const department = await Department.findById(req.body.department);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Departamento no válido'
      });
    }
    
    const employee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      department: req.body.department,
      position: req.body.position,
      email: req.body.email,
      phone: req.body.phone
    });
    
    const savedEmployee = await employee.save();
    console.log('Empleado creado:', savedEmployee);
    
    // Poblar el departamento para la respuesta
    const populatedEmployee = await Employee.findById(savedEmployee._id)
      .populate('department', 'name description');
    
    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: populatedEmployee
    });
  } catch (error) {
    console.error('Error creando empleado:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear empleado'
    });
  }
};

// Obtener todos los empleados
exports.findAll = async (req, res) => {
  try {
    console.log('Obteniendo todos los empleados...');
    
    const employees = await Employee.find()
      .populate('department', 'name description')
      .sort({ lastName: 1, firstName: 1 });
    
    console.log(`Encontrados ${employees.length} empleados`);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error obteniendo empleados:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener empleados'
    });
  }
};

// Obtener empleado por ID
exports.findOne = async (req, res) => {
  try {
    console.log('Buscando empleado con ID:', req.params.id);
    
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name description');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    
    console.log('Empleado encontrado:', employee);
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error buscando empleado:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al buscar empleado'
    });
  }
};

// Obtener empleados por departamento
exports.findByDepartment = async (req, res) => {
  try {
    console.log('Buscando empleados del departamento:', req.params.departmentId);
    
    const employees = await Employee.find({ department: req.params.departmentId })
      .populate('department', 'name description')
      .sort({ lastName: 1, firstName: 1 });
    
    console.log(`Encontrados ${employees.length} empleados en el departamento`);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error buscando empleados por departamento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al buscar empleados'
    });
  }
};

// Actualizar empleado
exports.update = async (req, res) => {
  try {
    console.log('Actualizando empleado:', req.params.id, req.body);
    
    // Si se está actualizando el departamento, verificar que existe
    if (req.body.department) {
      const department = await Department.findById(req.body.department);
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Departamento no válido'
        });
      }
    }
    
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        department: req.body.department,
        position: req.body.position,
        email: req.body.email,
        phone: req.body.phone,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('department', 'name description');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    
    console.log('Empleado actualizado:', employee);
    
    res.status(200).json({
      success: true,
      message: 'Empleado actualizado exitosamente',
      data: employee
    });
  } catch (error) {
    console.error('Error actualizando empleado:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar empleado'
    });
  }
};

// Eliminar empleado
exports.delete = async (req, res) => {
  try {
    console.log('Eliminando empleado:', req.params.id);
    
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    
    console.log('Empleado eliminado:', employee);
    
    res.status(200).json({
      success: true,
      message: 'Empleado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando empleado:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar empleado'
    });
  }
};

// Buscar empleados
exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Buscando empleados con query:', query);
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query de búsqueda requerido'
      });
    }
    
    const employees = await Employee.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { position: { $regex: query, $options: 'i' } }
      ]
    }).populate('department', 'name description');
    
    console.log(`Encontrados ${employees.length} empleados con la búsqueda`);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error buscando empleados:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error en la búsqueda'
    });
  }
};