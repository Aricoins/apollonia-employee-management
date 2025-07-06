const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { validateDepartment, validateParamId } = require('../middleware/validation');

// Crear departamento
router.post('/', validateDepartment, departmentController.create);

// Obtener todos los departamentos
router.get('/', departmentController.findAll);

// Obtener empleados de un departamento específico
router.get('/:id/employees', validateParamId, departmentController.getEmployees);

// Obtener departamento por ID
router.get('/:id', validateParamId, departmentController.findOne);

// Actualizar departamento
router.put('/:id', validateParamId, validateDepartment, departmentController.update);

// Eliminar departamento
router.delete('/:id', validateParamId, departmentController.delete);

module.exports = router;