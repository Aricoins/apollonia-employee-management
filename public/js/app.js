// Estado de la aplicación
const app = {
    apiBase: '',
    departments: [],
    employees: [],
    editingItem: null
};

// Función para mostrar mensajes de estado
function showStatus(message, type = 'loading') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
}

// Función para mostrar alertas
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Remover alerta después de 5 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

// Función para realizar peticiones HTTP
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${app.apiBase}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en petición API:', error);
        throw error;
    }
}

// Probar conectividad de la API
async function testAPI() {
    showStatus('Probando conexión a la API...', 'loading');
    try {
        const data = await apiRequest('/api/test');
        showStatus(`✅ ${data.message}`, 'success');
        console.log('Respuesta de la API:', data);
    } catch (error) {
        showStatus(`❌ Error de conexión: ${error.message}`, 'error');
        console.error('Error:', error);
    }
}

// Cargar y mostrar departamentos
async function loadDepartments() {
    const container = document.getElementById('departments-list');
    container.innerHTML = '<div class="loading">Cargando departamentos...</div>';
    
    try {
        const data = await apiRequest('/api/departments');
        app.departments = data.data;
        
        if (data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(dept => `
                <div class="data-item">
                    <strong>${dept.name}</strong>
                    <br><small>${dept.description || 'Sin descripción'}</small>
                    <div class="actions">
                        <button onclick="editDepartment('${dept._id}')" class="btn btn-warning btn-small">Editar</button>
                        <button onclick="deleteDepartment('${dept._id}')" class="btn btn-danger btn-small">Eliminar</button>
                    </div>
                </div>
            `).join('');
            showStatus(`✅ ${data.data.length} departamentos cargados`, 'success');
        } else {
            container.innerHTML = '<div class="error">No hay departamentos disponibles</div>';
        }
    } catch (error) {
        container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        showStatus(`❌ Error cargando departamentos: ${error.message}`, 'error');
    }
}

// Cargar y mostrar empleados
async function loadEmployees() {
    const container = document.getElementById('employees-list');
    container.innerHTML = '<div class="loading">Cargando empleados...</div>';
    
    try {
        const data = await apiRequest('/api/employees');
        app.employees = data.data;
        
        if (data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(emp => `
                <div class="data-item">
                    <strong>${emp.firstName} ${emp.lastName}</strong>
                    <br><small>Departamento: ${emp.department ? emp.department.name : 'Sin departamento'}</small>
                    <br><small>Posición: ${emp.position || 'Sin posición'}</small>
                    ${emp.email ? `<br><small>Email: ${emp.email}</small>` : ''}
                    <div class="actions">
                        <button onclick="editEmployee('${emp._id}')" class="btn btn-warning btn-small">Editar</button>
                        <button onclick="deleteEmployee('${emp._id}')" class="btn btn-danger btn-small">Eliminar</button>
                    </div>
                </div>
            `).join('');
            showStatus(`✅ ${data.data.length} empleados cargados`, 'success');
        } else {
            container.innerHTML = '<div class="error">No hay empleados disponibles</div>';
        }
    } catch (error) {
        container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        showStatus(`❌ Error cargando empleados: ${error.message}`, 'error');
    }
}

// =====================
// FUNCIONES PARA MODAL
// =====================

function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    app.editingItem = null;
}

// =====================
// FUNCIONES PARA DEPARTAMENTOS
// =====================

async function showCreateDepartmentForm() {
    const departments = ['General Dentistry', 'Pediatric Dentistry', 'Restorative Dentistry', 'Surgery', 'Orthodontics'];
    
    const content = `
        <form id="department-form" class="crud-form">
            <h4>Crear Nuevo Departamento</h4>
            <div class="form-group">
                <label for="dept-name">Nombre del Departamento:</label>
                <select id="dept-name" required>
                    <option value="">Seleccionar departamento</option>
                    ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="dept-description">Descripción:</label>
                <textarea id="dept-description" rows="3" placeholder="Descripción del departamento"></textarea>
            </div>
            <div class="form-buttons">
                <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Departamento</button>
            </div>
        </form>
    `;
    
    showModal(content);
    
    document.getElementById('department-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createDepartment();
    });
}

async function createDepartment() {
    const formData = {
        name: document.getElementById('dept-name').value,
        description: document.getElementById('dept-description').value
    };
    
    try {
        const response = await apiRequest('/api/departments', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (response.success) {
            showAlert('✅ Departamento creado exitosamente', 'success');
            closeModal();
            loadDepartments();
        } else {
            showAlert(`❌ Error: ${response.message}`, 'error');
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

async function editDepartment(id) {
    try {
        const response = await apiRequest(`/api/departments/${id}`);
        const dept = response.data;
        
        const departments = ['General Dentistry', 'Pediatric Dentistry', 'Restorative Dentistry', 'Surgery', 'Orthodontics'];
        
        const content = `
            <form id="department-form" class="crud-form">
                <h4>Editar Departamento</h4>
                <div class="form-group">
                    <label for="dept-name">Nombre del Departamento:</label>
                    <select id="dept-name" required>
                        ${departments.map(d => `<option value="${d}" ${d === dept.name ? 'selected' : ''}>${d}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="dept-description">Descripción:</label>
                    <textarea id="dept-description" rows="3">${dept.description || ''}</textarea>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-success">Actualizar Departamento</button>
                </div>
            </form>
        `;
        
        showModal(content);
        app.editingItem = id;
        
        document.getElementById('department-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateDepartment(id);
        });
    } catch (error) {
        showAlert(`❌ Error cargando departamento: ${error.message}`, 'error');
    }
}

async function updateDepartment(id) {
    const formData = {
        name: document.getElementById('dept-name').value,
        description: document.getElementById('dept-description').value
    };
    
    try {
        const response = await apiRequest(`/api/departments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        if (response.success) {
            showAlert('✅ Departamento actualizado exitosamente', 'success');
            closeModal();
            loadDepartments();
        } else {
            showAlert(`❌ Error: ${response.message}`, 'error');
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

async function deleteDepartment(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/api/departments/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            showAlert('✅ Departamento eliminado exitosamente', 'success');
            loadDepartments();
        } else {
            showAlert(`❌ Error: ${response.message}`, 'error');
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

// =====================
// FUNCIONES PARA EMPLEADOS
// =====================

async function showCreateEmployeeForm() {
    // Cargar departamentos para el select
    await loadDepartmentsForSelect();
    
    const content = `
        <form id="employee-form" class="crud-form">
            <h4>Crear Nuevo Empleado</h4>
            <div class="form-group">
                <label for="emp-firstName">Nombre:</label>
                <input type="text" id="emp-firstName" required>
            </div>
            <div class="form-group">
                <label for="emp-lastName">Apellido:</label>
                <input type="text" id="emp-lastName" required>
            </div>
            <div class="form-group">
                <label for="emp-department">Departamento:</label>
                <select id="emp-department" required>
                    <option value="">Seleccionar departamento</option>
                    ${app.departments.map(dept => `<option value="${dept._id}">${dept.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="emp-position">Posición:</label>
                <input type="text" id="emp-position" placeholder="Ej: Dentista General">
            </div>
            <div class="form-group">
                <label for="emp-email">Email:</label>
                <input type="email" id="emp-email" placeholder="empleado@apollonia.com">
            </div>
            <div class="form-buttons">
                <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Empleado</button>
            </div>
        </form>
    `;
    
    showModal(content);
    
    document.getElementById('employee-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createEmployee();
    });
}

async function createEmployee() {
    const formData = {
        firstName: document.getElementById('emp-firstName').value,
        lastName: document.getElementById('emp-lastName').value,
        department: document.getElementById('emp-department').value,
        position: document.getElementById('emp-position').value,
        email: document.getElementById('emp-email').value
    };
    
    try {
        const response = await apiRequest('/api/employees', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (response.success) {
            showAlert('✅ Empleado creado exitosamente', 'success');
            closeModal();
            loadEmployees();
        } else {
            showAlert(`❌ Error: ${response.message}`, 'error');
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

async function editEmployee(id) {
    try {
        // Cargar departamentos para el select
        await loadDepartmentsForSelect();
        
        const response = await apiRequest(`/api/employees/${id}`);
        const emp = response.data;
        
        const content = `
            <form id="employee-form" class="crud-form">
                <h4>Editar Empleado</h4>
                <div class="form-group">
                    <label for="emp-firstName">Nombre:</label>
                    <input type="text" id="emp-firstName" value="${emp.firstName}" required>
                </div>
                <div class="form-group">
                    <label for="emp-lastName">Apellido:</label>
                    <input type="text" id="emp-lastName" value="${emp.lastName}" required>
                </div>
                <div class="form-group">
                    <label for="emp-department">Departamento:</label>
                    <select id="emp-department" required>
                        ${app.departments.map(dept => `<option value="${dept._id}" ${dept._id === emp.department._id ? 'selected' : ''}>${dept.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="emp-position">Posición:</label>
                    <input type="text" id="emp-position" value="${emp.position || ''}">
                </div>
                <div class="form-group">
                    <label for="emp-email">Email:</label>
                    <input type="email" id="emp-email" value="${emp.email || ''}">
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-success">Actualizar Empleado</button>
                </div>
            </form>
        `;
        
        showModal(content);
        app.editingItem = id;
        
        document.getElementById('employee-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateEmployee(id);
        });
    } catch (error) {
        showAlert(`❌ Error cargando empleado: ${error.message}`, 'error');
    }
}

async function updateEmployee(id) {
    const formData = {
        firstName: document.getElementById('emp-firstName').value,
        lastName: document.getElementById('emp-lastName').value,
        department: document.getElementById('emp-department').value,
        position: document.getElementById('emp-position').value,
        email: document.getElementById('emp-email').value
    };
    
    try {
        const response = await apiRequest(`/api/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        if (response.success) {
            showAlert('✅ Empleado actualizado exitosamente', 'success');
            closeModal();
            loadEmployees();
        } else {
            showAlert(`❌ Error: ${response.message}`, 'error');
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

async function deleteEmployee(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/api/employees/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            showAlert('✅ Empleado eliminado exitosamente', 'success');
            loadEmployees();
        } else {
            showAlert(`❌ Error: ${response.message}`, 'error');
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

// =====================
// FUNCIONES AUXILIARES
// =====================

async function loadDepartmentsForSelect() {
    if (app.departments.length === 0) {
        try {
            const data = await apiRequest('/api/departments');
            app.departments = data.data;
        } catch (error) {
            console.error('Error cargando departamentos:', error);
        }
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicación Apollonia iniciada');
    
    // Probar API automáticamente
    testAPI();
    
    // Cargar datos iniciales
    setTimeout(() => {
        loadDepartments();
        loadEmployees();
    }, 1000);
});

// Funciones de utilidad
window.testAPI = testAPI;
window.loadDepartments = loadDepartments;
window.loadEmployees = loadEmployees;
window.showCreateDepartmentForm = showCreateDepartmentForm;
window.showCreateEmployeeForm = showCreateEmployeeForm;
window.editDepartment = editDepartment;
window.editEmployee = editEmployee;
window.deleteDepartment = deleteDepartment;
window.deleteEmployee = deleteEmployee;
window.closeModal = closeModal;