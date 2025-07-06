const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validación para empleados
exports.validateEmployee = [
  body('firstName')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('lastName')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('department')
    .notEmpty()
    .withMessage('El departamento es requerido')
    .isMongoId()
    .withMessage('ID de departamento inválido'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('position')
    .optional()
    .isLength({ max: 100 })
    .withMessage('La posición no puede exceder 100 caracteres'),
  
  handleValidationErrors
];

// Validación para departamentos
exports.validateDepartment = [
  body('name')
    .notEmpty()
    .withMessage('El nombre del departamento es requerido')
    .isIn([
      'General Dentistry',
      'Pediatric Dentistry',
      'Restorative Dentistry',
      'Surgery',
      'Orthodontics'
    ])
    .withMessage('Departamento inválido. Debe ser uno de: General Dentistry, Pediatric Dentistry, Restorative Dentistry, Surgery, Orthodontics'),
  
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La descripción no puede exceder 200 caracteres'),
  
  handleValidationErrors
];

// Validación para IDs de MongoDB
exports.validateMongoId = [
  body('id')
    .isMongoId()
    .withMessage('ID inválido'),
  
  handleValidationErrors
];

// Validación para parámetros de URL
exports.validateParamId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    });
  }
  
  next();
};