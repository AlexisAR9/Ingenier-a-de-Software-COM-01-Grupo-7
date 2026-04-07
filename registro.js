const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const title = document.getElementById('form-title');

function nextStep() {
    if(!document.getElementById('c-name').value || !document.getElementById('c-email').value) {
        alert("Llena nombre y correo para continuar"); return;
    }
    step1.style.display = 'none';
    step2.style.display = 'block';
    title.textContent = "Paso 2: Datos del Taller";
}

function prevStep() {
    step2.style.display = 'none';
    step1.style.display = 'block';
    title.textContent = "Paso 1: Datos Personales";
}

function toggleFields() {
    const isPropio = document.getElementById('w-type').value === 'propio';
    document.getElementById('fields-propio').style.display = isPropio ? 'block' : 'none';
    document.getElementById('fields-part').style.display = isPropio ? 'none' : 'block';
}

function guardarTaller(e) {
    e.preventDefault();
    
    // Leer la base de datos actual del navegador
    let db = JSON.parse(localStorage.getItem('cc_talleres')) || [];
    
    const tipo = document.getElementById('w-type').value;
    const nuevo = {
        id: db.length + 1,
        name: document.getElementById('w-name').value,
        description: document.getElementById('w-desc').value,
        category: document.getElementById('w-cat').value,
        type: tipo,
        image: document.getElementById('w-img').value,
        activities: document.getElementById('w-act').value.split(',').map(i => i.trim()),
        phone: document.getElementById('w-tel').value,
        social: document.getElementById('w-soc').value,
        locationData: tipo === 'propio' ? {
            modulo: document.getElementById('w-mod').value,
            aula: document.getElementById('w-aula').value
        } : {
            address: document.getElementById('w-dir').value,
            hours: document.getElementById('w-hrs').value,
            lat: -34.4833, // Simulador de latitud
            lng: -58.7167  // Simulador de longitud
        }
    };

    db.push(nuevo);
    localStorage.setItem('cc_talleres', JSON.stringify(db)); // Guardar
    
    alert("¡Taller registrado con éxito!");
    
    // Resetear formulario y volver al paso 1
    document.getElementById('reg-form').reset();
    prevStep();
    toggleFields();
}