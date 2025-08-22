// Estado de la aplicación
const app = {
    apiBase: '',
    departments: [], // Para paginación en la vista principal
    allDepartments: [], // Para selects de formularios
    employees: [],
    editingItem: null,
    pagination: {
        departmentsPage: 1,
        employeesPage: 1,
        limit: 5
    }
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
async function loadDepartments(page = 1) {
    const container = document.getElementById('departments-list');
    container.innerHTML = '<div class="loading">Cargando departamentos...</div>';
    
    try {
        app.pagination.departmentsPage = page;
        const data = await apiRequest(`/api/departments?page=${page}&limit=${app.pagination.limit}`);
        app.departments = data.data;
        
        if (data.data && data.data.length > 0) {
            let html = data.data.map(dept => `
                <div class="data-item">
                    <strong>${dept.name}</strong>
                    <br><small>${dept.description || 'Sin descripción'}</small>
                    <div class="actions">
                        <button onclick="editDepartment('${dept._id}')" class="btn btn-warning btn-small">Editar</button>
                        <button onclick="deleteDepartment('${dept._id}')" class="btn btn-danger btn-small">Eliminar</button>
                    </div>
                </div>
            `).join('');
            
            // Agregar controles de paginación
            html += createPaginationControls(data, 'especialidades');
            container.innerHTML = html;
            showStatus(`✅ ${data.total} especialidades disponibles`, 'success');
        } else {
            container.innerHTML = '<div class="error">No hay especialidades disponibles</div>';
        }
    } catch (error) {
        container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        showStatus(`❌ Error cargando especialidades: ${error.message}`, 'error');
    }
}

// Cargar y mostrar empleados
async function loadEmployees(page = 1) {
    const container = document.getElementById('employees-list');
    container.innerHTML = '<div class="loading">Cargando empleados...</div>';
    
    try {
        app.pagination.employeesPage = page;
        const data = await apiRequest(`/api/employees?page=${page}&limit=${app.pagination.limit}`);
        app.employees = data.data;
        
        if (data.data && data.data.length > 0) {
            let html = data.data.map(emp => `
                <div class="data-item">
                    <strong>${emp.firstName} ${emp.lastName}</strong>
                    <br><small>Especialidad: ${emp.department ? emp.department.name : 'Sin especialidad'}</small>
                    <br><small>Cargo: ${emp.position || 'Sin cargo'}</small>
                    ${emp.email ? `<br><small>Email: ${emp.email}</small>` : ''}
                    <div class="actions">
                        <button onclick="editEmployee('${emp._id}')" class="btn btn-warning btn-small">Editar</button>
                        <button onclick="deleteEmployee('${emp._id}')" class="btn btn-danger btn-small">Eliminar</button>
                    </div>
                </div>
            `).join('');
            
            // Agregar controles de paginación
            html += createPaginationControls(data, 'profesionales');
            container.innerHTML = html;
            showStatus(`✅ ${data.total} profesionales disponibles`, 'success');
        } else {
            container.innerHTML = '<div class="error">No hay profesionales disponibles</div>';
        }
    } catch (error) {
        container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        showStatus(`❌ Error cargando profesionales: ${error.message}`, 'error');
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
    const suggestedDepartments = ['Odontología General', 'Odontología Pediátrica', 'Endodoncia', 'Periodoncia', 'Ortodoncia', 'Cirugía Oral', 'Implantología', 'Estética Dental', 'Prostodoncia', 'Radiología Dental'];
    
    const content = `
        <form id="department-form" class="crud-form">
            <h4>Crear Nueva Especialidad</h4>
            <div class="form-group">
                <label for="dept-name">Nombre de la Especialidad:</label>
                <input type="text" id="dept-name" list="dept-suggestions" required maxlength="100" minlength="3" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Escribir o seleccionar especialidad" title="Solo letras y espacios, mínimo 3 caracteres">
                <datalist id="dept-suggestions">
                    ${suggestedDepartments.map(dept => `<option value="${dept}">`).join('')}
                </datalist>
            </div>
            <div class="form-group">
                <label for="dept-description">Descripción:</label>
                <textarea id="dept-description" rows="3" maxlength="500" placeholder="Descripción de la especialidad (opcional)"></textarea>
            </div>
            <div class="form-buttons">
                <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Especialidad</button>
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
            showAlert('✅ Especialidad creada exitosamente', 'success');
            closeModal();
            loadDepartments();
            // Limpiar cache de departamentos para forzar recarga en selects
            app.allDepartments = [];
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
        
        const suggestedDepartments = ['Odontología General', 'Odontología Pediátrica', 'Endodoncia', 'Periodoncia', 'Ortodoncia', 'Cirugía Oral', 'Implantología', 'Estética Dental', 'Prostodoncia', 'Radiología Dental'];
        
        const content = `
            <form id="department-form" class="crud-form">
                <h4>Editar Especialidad</h4>
                <div class="form-group">
                    <label for="dept-name">Nombre de la Especialidad:</label>
                    <input type="text" id="dept-name" list="dept-suggestions" value="${dept.name}" required maxlength="100" minlength="3" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Escribir o seleccionar especialidad" title="Solo letras y espacios, mínimo 3 caracteres">
                    <datalist id="dept-suggestions">
                        ${suggestedDepartments.map(d => `<option value="${d}">`).join('')}
                    </datalist>
                </div>
                <div class="form-group">
                    <label for="dept-description">Descripción:</label>
                    <textarea id="dept-description" rows="3" maxlength="500">${dept.description || ''}</textarea>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-success">Actualizar Especialidad</button>
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
            showAlert('✅ Especialidad actualizada exitosamente', 'success');
            closeModal();
            loadDepartments();
            // Limpiar cache de departamentos para forzar recarga en selects
            app.allDepartments = [];
        } else {
            showAlert(`❌ Error: ${response.message}`, 'error');
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

async function deleteDepartment(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta especialidad?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/api/departments/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            showAlert('✅ Especialidad eliminada exitosamente', 'success');
            loadDepartments();
            // Limpiar cache de departamentos para forzar recarga en selects
            app.allDepartments = [];
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
            <h4>Crear Nuevo Profesional</h4>
            <div class="form-group">
                <label for="emp-firstName">Nombre:</label>
                <input type="text" id="emp-firstName" required minlength="2" maxlength="50" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Nombre del profesional" title="Solo letras y espacios, mínimo 2 caracteres">
            </div>
            <div class="form-group">
                <label for="emp-lastName">Apellido:</label>
                <input type="text" id="emp-lastName" required minlength="2" maxlength="50" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Apellido del profesional" title="Solo letras y espacios, mínimo 2 caracteres">
            </div>
            <div class="form-group">
                <label for="emp-department">Especialidad:</label>
                <select id="emp-department" required>
                    <option value="">Seleccionar especialidad</option>
                    ${app.allDepartments.map(dept => `<option value="${dept._id}">${dept.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="emp-position">Cargo:</label>
                <input type="text" id="emp-position" maxlength="100" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Ej: Odontólogo General, Especialista en Endodoncia" title="Solo letras y espacios">
            </div>
            <div class="form-group">
                <label for="emp-email">Email:</label>
                <input type="email" id="emp-email" maxlength="100" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" placeholder="profesional@apollonia.com" title="Formato de email válido">
            </div>
            <div class="form-buttons">
                <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Profesional</button>
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
            showAlert('✅ Profesional creado exitosamente', 'success');
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
                <h4>Editar Profesional</h4>
                <div class="form-group">
                    <label for="emp-firstName">Nombre:</label>
                    <input type="text" id="emp-firstName" value="${emp.firstName}" required minlength="2" maxlength="50" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Nombre del profesional" title="Solo letras y espacios, mínimo 2 caracteres">
                </div>
                <div class="form-group">
                    <label for="emp-lastName">Apellido:</label>
                    <input type="text" id="emp-lastName" value="${emp.lastName}" required minlength="2" maxlength="50" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Apellido del profesional" title="Solo letras y espacios, mínimo 2 caracteres">
                </div>
                <div class="form-group">
                    <label for="emp-department">Especialidad:</label>
                    <select id="emp-department" required>
                        ${app.allDepartments.map(dept => `<option value="${dept._id}" ${dept._id === emp.department._id ? 'selected' : ''}>${dept.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="emp-position">Cargo:</label>
                    <input type="text" id="emp-position" value="${emp.position || ''}" maxlength="100" pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+" placeholder="Ej: Odontólogo General, Especialista en Endodoncia" title="Solo letras y espacios">
                </div>
                <div class="form-group">
                    <label for="emp-email">Email:</label>
                    <input type="email" id="emp-email" value="${emp.email || ''}" maxlength="100" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" placeholder="profesional@apollonia.com" title="Formato de email válido">
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-success">Actualizar Profesional</button>
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
            showAlert('✅ Profesional actualizado exitosamente', 'success');
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
    if (!confirm('¿Estás seguro de que quieres eliminar este profesional?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/api/employees/${id}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            showAlert('✅ Profesional eliminado exitosamente', 'success');
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

// Función para crear controles de paginación
function createPaginationControls(data, type) {
    if (data.totalPages <= 1) return '';
    
    let html = '<div class="pagination-controls">';
    
    // Botón anterior
    if (data.hasPrevPage) {
        html += `<button onclick="load${type === 'especialidades' ? 'Departments' : 'Employees'}(${data.currentPage - 1})" class="btn btn-secondary btn-small">« Anterior</button>`;
    }
    
    // Información de página
    html += `<span class="page-info">Página ${data.currentPage} de ${data.totalPages} (${data.total} total)</span>`;
    
    // Botón siguiente
    if (data.hasNextPage) {
        html += `<button onclick="load${type === 'especialidades' ? 'Departments' : 'Employees'}(${data.currentPage + 1})" class="btn btn-secondary btn-small">Siguiente »</button>`;
    }
    
    html += '</div>';
    return html;
}

async function loadDepartmentsForSelect() {
    if (app.allDepartments.length === 0) {
        try {
            const data = await apiRequest('/api/departments?limit=100');
            app.allDepartments = data.data || [];
            console.log(`Cargadas ${app.allDepartments.length} especialidades para selección`);
        } catch (error) {
            console.error('Error cargando especialidades para select:', error);
            app.allDepartments = [];
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