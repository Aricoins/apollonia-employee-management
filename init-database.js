const mongoose = require('mongoose');
const Department = require('./app/models/department.model');
const Employee = require('./app/models/employee.model');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    // Conectar a MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apollonia_db';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Department.deleteMany({});
    await Employee.deleteMany({});
    console.log('🧹 Datos existentes eliminados');

    // Crear departamentos
    const departments = [
      {
        name: 'Odontología General',
        description: 'Atención dental general y preventiva'
      },
      {
        name: 'Odontología Pediátrica',
        description: 'Especialización en odontología infantil'
      },
      {
        name: 'Odontología Restauradora',
        description: 'Restauración y rehabilitación dental'
      },
      {
        name: 'Cirugía',
        description: 'Cirugía oral y maxilofacial'
      },
      {
        name: 'Ortodoncia',
        description: 'Corrección de malposiciones dentales'
      }
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ ${createdDepartments.length} departamentos creados`);

    // Crear empleados de ejemplo
    const employees = [
      {
        firstName: 'Carmen',
        lastName: 'García López',
        department: createdDepartments[2]._id, // Odontología Restauradora
        position: 'Odontóloga Restauradora',
        email: 'carmen.garcia@apollonia.com'
      },
      {
        firstName: 'Alejandro',
        lastName: 'Martínez Ruiz',
        department: createdDepartments[0]._id, // Odontología General
        position: 'Odontólogo General',
        email: 'alejandro.martinez@apollonia.com'
      },
      {
        firstName: 'Francisco',
        lastName: 'Hernández Silva',
        department: createdDepartments[0]._id, // Odontología General
        position: 'Odontólogo General',
        email: 'francisco.hernandez@apollonia.com'
      },
      {
        firstName: 'Isabel',
        lastName: 'Fernández Castro',
        department: createdDepartments[2]._id, // Odontología Restauradora
        position: 'Técnica Dental',
        email: 'isabel.fernandez@apollonia.com'
      },
      {
        firstName: 'Pilar',
        lastName: 'Rodríguez Moreno',
        department: createdDepartments[1]._id, // Odontología Pediátrica
        position: 'Odontóloga Pediátrica',
        email: 'pilar.rodriguez@apollonia.com'
      },
      {
        firstName: 'Miguel',
        lastName: 'Jiménez Vázquez',
        department: createdDepartments[3]._id, // Cirugía
        position: 'Cirujano Oral',
        email: 'miguel.jimenez@apollonia.com'
      },
      {
        firstName: 'Ana',
        lastName: 'López Sánchez',
        department: createdDepartments[4]._id, // Ortodoncia
        position: 'Ortodoncista',
        email: 'ana.lopez@apollonia.com'
      },
      {
        firstName: 'Carlos',
        lastName: 'Morales Díaz',
        department: createdDepartments[0]._id, // Odontología General
        position: 'Higienista Dental',
        email: 'carlos.morales@apollonia.com'
      },
      {
        firstName: 'Lucía',
        lastName: 'Pérez Romero',
        department: createdDepartments[1]._id, // Odontología Pediátrica
        position: 'Auxiliar de Clínica',
        email: 'lucia.perez@apollonia.com'
      },
      {
        firstName: 'Javier',
        lastName: 'Torres Muñoz',
        department: createdDepartments[3]._id, // Cirugía
        position: 'Anestesista',
        email: 'javier.torres@apollonia.com'
      }
    ];

    const createdEmployees = await Employee.insertMany(employees);
    console.log(`✅ ${createdEmployees.length} empleados creados`);

    console.log('\n📊 Datos iniciales creados exitosamente:');
    console.log(`   - ${createdDepartments.length} departamentos`);
    console.log(`   - ${createdEmployees.length} empleados`);

    // Mostrar resumen
    console.log('\n🏥 Departamentos creados:');
    createdDepartments.forEach(dept => {
      console.log(`   - ${dept.name}: ${dept.description}`);
    });

    console.log('\n👥 Empleados creados:');
    for (const emp of createdEmployees) {
      const populatedEmp = await Employee.findById(emp._id).populate('department');
      console.log(`   - ${populatedEmp.firstName} ${populatedEmp.lastName} (${populatedEmp.department.name})`);
    }

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
};

// Ejecutar solo si se llama directamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
