// Estado de la aplicación de turnos
const appointmentsApp = {
    appointments: [],
    professionals: [],
    specialties: [],
    currentDate: new Date(),
    selectedDate: new Date(),
    timeSlots: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30'
    ]
};

// Inicializar aplicación de turnos
document.addEventListener('DOMContentLoaded', function() {
    console.log('🗓️ Sistema de turnos iniciado');
    initializeAppointments();
});

async function initializeAppointments() {
    showStatus('Inicializando sistema de turnos...', 'loading');
    
    try {
        // Cargar datos necesarios
        await loadProfessionalsForAppointments();
        await loadSpecialtiesForAppointments();
        
        // Generar calendario
        generateCalendar();
        
        // Cargar turnos del día actual
        await loadAppointmentsForDate(appointmentsApp.selectedDate);
        
        showStatus('✅ Sistema de turnos listo', 'success');
    } catch (error) {
        console.error('Error inicializando turnos:', error);
        showStatus('❌ Error al cargar sistema de turnos', 'error');
    }
}

// Cargar profesionales para turnos
async function loadProfessionalsForAppointments() {
    try {
        const data = await apiRequest('/api/employees?limit=100');
        appointmentsApp.professionals = data.data || [];
    } catch (error) {
        console.error('Error cargando profesionales:', error);
        appointmentsApp.professionals = [];
    }
}

// Cargar especialidades para turnos
async function loadSpecialtiesForAppointments() {
    try {
        const data = await apiRequest('/api/departments?limit=100');
        appointmentsApp.specialties = data.data || [];
    } catch (error) {
        console.error('Error cargando especialidades:', error);
        appointmentsApp.specialties = [];
    }
}

// Generar calendario
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearElement = document.getElementById('calendar-month-year');
    
    const year = appointmentsApp.currentDate.getFullYear();
    const month = appointmentsApp.currentDate.getMonth();
    
    // Actualizar título del mes
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    
    // Limpiar grid
    calendarGrid.innerHTML = '';
    
    // Agregar headers de días
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Obtener primer día del mes y días en el mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Agregar días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayElement = createCalendarDay(
            prevMonth.getDate() - i,
            new Date(year, month - 1, prevMonth.getDate() - i),
            true
        );
        calendarGrid.appendChild(dayElement);
    }
    
    // Agregar días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = createCalendarDay(day, date, false);
        calendarGrid.appendChild(dayElement);
    }
    
    // Agregar días del mes siguiente para completar la grilla
    const totalCells = calendarGrid.children.length - 7; // -7 por los headers
    const remainingCells = 42 - totalCells; // 6 semanas * 7 días
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createCalendarDay(
            day,
            new Date(year, month + 1, day),
            true
        );
        calendarGrid.appendChild(dayElement);
    }
}

// Crear elemento de día del calendario
function createCalendarDay(dayNumber, date, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = dayNumber;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    // Marcar día actual
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayElement.classList.add('today');
    }
    
    // Marcar día seleccionado
    if (date.toDateString() === appointmentsApp.selectedDate.toDateString()) {
        dayElement.classList.add('selected');
    }
    
    // Agregar event listener
    dayElement.addEventListener('click', () => {
        selectDate(date);
    });
    
    return dayElement;
}

// Seleccionar fecha
async function selectDate(date) {
    appointmentsApp.selectedDate = date;
    
    // Actualizar calendario visual
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    
    // Actualizar fecha seleccionada en la UI
    const selectedDateElement = document.getElementById('selected-date');
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
        selectedDateElement.textContent = 'Hoy';
    } else {
        selectedDateElement.textContent = date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Cargar turnos para la fecha seleccionada
    await loadAppointmentsForDate(date);
}

// Cargar turnos para una fecha específica
async function loadAppointmentsForDate(date) {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '<div class="loading">Cargando turnos...</div>';
    
    try {
        // Simular datos de turnos (en una implementación real, esto vendría de la API)
        const mockAppointments = generateMockAppointments(date);
        appointmentsApp.appointments = mockAppointments;
        
        if (mockAppointments.length > 0) {
            let html = mockAppointments.map(appointment => `
                <div class="appointment-item ${appointment.status}">
                    <div class="appointment-status ${appointment.status}">${getStatusText(appointment.status)}</div>
                    <div class="appointment-time">${appointment.time}</div>
                    <div class="appointment-patient">👤 ${appointment.patientName}</div>
                    <div class="appointment-professional">👨‍⚕️ ${appointment.professional}</div>
                    <div class="appointment-specialty">🏥 ${appointment.specialty}</div>
                    <div class="appointment-actions">
                        <button onclick="editAppointment('${appointment.id}')" class="btn btn-warning btn-small">Editar</button>
                        <button onclick="confirmAppointment('${appointment.id}')" class="btn btn-success btn-small">Confirmar</button>
                        <button onclick="cancelAppointment('${appointment.id}')" class="btn btn-danger btn-small">Cancelar</button>
                    </div>
                </div>
            `).join('');
            
            appointmentsList.innerHTML = html;
        } else {
            appointmentsList.innerHTML = '<div class="error">No hay turnos programados para esta fecha</div>';
        }
    } catch (error) {
        console.error('Error cargando turnos:', error);
        appointmentsList.innerHTML = '<div class="error">Error al cargar turnos</div>';
    }
}

// Generar datos mock de turnos
function generateMockAppointments(date) {
    const appointments = [];
    const patientNames = [
        'María González', 'Juan Pérez', 'Ana Martínez', 'Carlos López',
        'Laura Rodríguez', 'Miguel Torres', 'Carmen Sánchez', 'David Ruiz'
    ];
    
    const statuses = ['pending', 'confirmed', 'completed'];
    const randomCount = Math.floor(Math.random() * 6) + 1; // 1-6 turnos por día
    
    for (let i = 0; i < randomCount; i++) {
        const timeSlot = appointmentsApp.timeSlots[Math.floor(Math.random() * appointmentsApp.timeSlots.length)];
        const professional = appointmentsApp.professionals[Math.floor(Math.random() * appointmentsApp.professionals.length)];
        const specialty = appointmentsApp.specialties[Math.floor(Math.random() * appointmentsApp.specialties.length)];
        
        appointments.push({
            id: `apt_${Date.now()}_${i}`,
            time: timeSlot,
            patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
            professional: professional ? `${professional.firstName} ${professional.lastName}` : 'Dr. Smith',
            specialty: specialty ? specialty.name : 'Odontología General',
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: date.toISOString().split('T')[0]
        });
    }
    
    return appointments.sort((a, b) => a.time.localeCompare(b.time));
}

// Obtener texto del estado
function getStatusText(status) {
    const statusTexts = {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        cancelled: 'Cancelado',
        completed: 'Completado'
    };
    return statusTexts[status] || status;
}

// Mostrar formulario de nuevo turno
async function showCreateAppointmentForm() {
    const content = `
        <form id="appointment-form" class="crud-form">
            <h4>Nuevo Turno</h4>
            <div class="form-group">
                <label for="patient-name">Nombre del Paciente:</label>
                <input type="text" id="patient-name" required minlength="2" maxlength="100" 
                       pattern="[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+" 
                       placeholder="Nombre completo del paciente" 
                       title="Solo letras, espacios y tildes, mínimo 2 caracteres">
            </div>
            <div class="form-group">
                <label for="patient-phone">Teléfono:</label>
                <input type="tel" id="patient-phone" maxlength="15" 
                       pattern="[0-9\s\-\+\(\)]+" 
                       placeholder="+34 91 555 0142" 
                       title="Solo números, espacios y símbolos telefónicos">
            </div>
            <div class="form-group">
                <label for="appointment-date">Fecha:</label>
                <input type="date" id="appointment-date" required 
                       min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label for="appointment-specialty">Especialidad:</label>
                <select id="appointment-specialty" required>
                    <option value="">Seleccionar especialidad</option>
                    ${appointmentsApp.specialties.map(spec => `<option value="${spec._id}">${spec.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="appointment-professional">Profesional:</label>
                <select id="appointment-professional" required>
                    <option value="">Seleccionar profesional</option>
                    ${appointmentsApp.professionals.map(prof => `<option value="${prof._id}">${prof.firstName} ${prof.lastName}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Horario Disponible:</label>
                <div class="time-slots" id="time-slots">
                    ${appointmentsApp.timeSlots.map(time => `
                        <div class="time-slot" onclick="selectTimeSlot('${time}')">${time}</div>
                    `).join('')}
                </div>
                <input type="hidden" id="selected-time" required>
            </div>
            <div class="form-group">
                <label for="appointment-notes">Notas (opcional):</label>
                <textarea id="appointment-notes" rows="3" maxlength="500" 
                          placeholder="Motivo de la consulta, observaciones..."></textarea>
            </div>
            <div class="form-buttons">
                <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear Turno</button>
            </div>
        </form>
    `;
    
    showModal(content);
    
    // Establecer fecha por defecto
    document.getElementById('appointment-date').value = appointmentsApp.selectedDate.toISOString().split('T')[0];
    
    document.getElementById('appointment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createAppointment();
    });
}

// Seleccionar horario
function selectTimeSlot(time) {
    // Remover selección anterior
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Seleccionar nuevo horario
    event.target.classList.add('selected');
    document.getElementById('selected-time').value = time;
}

// Crear turno
async function createAppointment() {
    const formData = {
        patientName: document.getElementById('patient-name').value,
        patientPhone: document.getElementById('patient-phone').value,
        date: document.getElementById('appointment-date').value,
        time: document.getElementById('selected-time').value,
        specialty: document.getElementById('appointment-specialty').value,
        professional: document.getElementById('appointment-professional').value,
        notes: document.getElementById('appointment-notes').value,
        status: 'pending'
    };
    
    if (!formData.time) {
        showAlert('❌ Por favor selecciona un horario', 'error');
        return;
    }
    
    try {
        // Simular creación de turno
        showAlert('✅ Turno creado exitosamente', 'success');
        closeModal();
        
        // Recargar turnos si es para la fecha seleccionada
        const selectedDate = new Date(formData.date);
        if (selectedDate.toDateString() === appointmentsApp.selectedDate.toDateString()) {
            await loadAppointmentsForDate(appointmentsApp.selectedDate);
        }
    } catch (error) {
        showAlert(`❌ Error: ${error.message}`, 'error');
    }
}

// Cargar turnos de hoy
async function loadTodayAppointments() {
    const today = new Date();
    appointmentsApp.selectedDate = today;
    appointmentsApp.currentDate = today;
    
    generateCalendar();
    await loadAppointmentsForDate(today);
    
    document.getElementById('selected-date').textContent = 'Hoy';
}

// Navegación del calendario
function previousMonth() {
    appointmentsApp.currentDate.setMonth(appointmentsApp.currentDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    appointmentsApp.currentDate.setMonth(appointmentsApp.currentDate.getMonth() + 1);
    generateCalendar();
}

// Mostrar vista calendario
function showCalendarView() {
    showAlert('📅 Vista de calendario activa', 'success');
}

// Acciones de turnos
async function editAppointment(id) {
    showAlert('✏️ Función de edición en desarrollo', 'warning');
}

async function confirmAppointment(id) {
    if (confirm('¿Confirmar este turno?')) {
        showAlert('✅ Turno confirmado', 'success');
        await loadAppointmentsForDate(appointmentsApp.selectedDate);
    }
}

async function cancelAppointment(id) {
    if (confirm('¿Cancelar este turno?')) {
        showAlert('❌ Turno cancelado', 'success');
        await loadAppointmentsForDate(appointmentsApp.selectedDate);
    }
}

// Funciones globales
window.showCreateAppointmentForm = showCreateAppointmentForm;
window.loadTodayAppointments = loadTodayAppointments;
window.showCalendarView = showCalendarView;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.selectTimeSlot = selectTimeSlot;
window.editAppointment = editAppointment;
window.confirmAppointment = confirmAppointment;
window.cancelAppointment = cancelAppointment;
