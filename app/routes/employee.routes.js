const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { validateEmployee, validateParamId } = require('../middleware/validation');

// Buscar empleados (debe ir antes de las rutas con parámetros)
router.get('/search', employeeController.search);

// Crear empleado
router.post('/', validateEmployee, employeeController.create);

// Obtener todos los empleados
router.get('/', employeeController.findAll);

// Obtener empleados por departamento
router.get('/department/:departmentId', validateParamId, employeeController.findByDepartment);

// Obtener empleado por ID
router.get('/:id', validateParamId, employeeController.findOne);

// Actualizar empleado
router.put('/:id', validateParamId, validateEmployee, employeeController.update);

// Eliminar empleado
router.delete('/:id', validateParamId, employeeController.delete);

module.exports = router;