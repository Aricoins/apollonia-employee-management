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
        name: 'General Dentistry',
        description: 'Atención dental general y preventiva'
      },
      {
        name: 'Pediatric Dentistry',
        description: 'Especialización en odontología infantil'
      },
      {
        name: 'Restorative Dentistry',
        description: 'Restauración y rehabilitación dental'
      },
      {
        name: 'Surgery',
        description: 'Cirugía oral y maxilofacial'
      },
      {
        name: 'Orthodontics',
        description: 'Corrección de malposiciones dentales'
      }
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ ${createdDepartments.length} departamentos creados`);

    // Crear empleados de ejemplo
    const employees = [
      {
        firstName: 'Lisa',
        lastName: 'Harris',
        department: createdDepartments[2]._id, // Restorative Dentistry
        position: 'Restorative Dentist',
        email: 'lisa.harris@apollonia.com'
      },
      {
        firstName: 'Alfred',
        lastName: 'Christensen',
        department: createdDepartments[0]._id, // General Dentistry
        position: 'General Dentist',
        email: 'alfred.christensen@apollonia.com'
      },
      {
        firstName: 'John',
        lastName: 'Dudley',
        department: createdDepartments[0]._id, // General Dentistry
        position: 'General Dentist',
        email: 'john.dudley@apollonia.com'
      },
      {
        firstName: 'Danny',
        lastName: 'Perez',
        department: createdDepartments[2]._id, // Restorative Dentistry
        position: 'Dental Technician',
        email: 'danny.perez@apollonia.com'
      },
      {
        firstName: 'Sarah',
        lastName: 'Alvarez',
        department: createdDepartments[1]._id, // Pediatric Dentistry
        position: 'Pediatric Dentist',
        email: 'sarah.alvarez@apollonia.com'
      },
      {
        firstName: 'Michael',
        lastName: 'Rodriguez',
        department: createdDepartments[3]._id, // Surgery
        position: 'Oral Surgeon',
        email: 'michael.rodriguez@apollonia.com'
      },
      {
        firstName: 'Emma',
        lastName: 'Thompson',
        department: createdDepartments[4]._id, // Orthodontics
        position: 'Orthodontist',
        email: 'emma.thompson@apollonia.com'
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
