const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const title = document.getElementById('form-title');

function nextStep() {
   // 1. Obtener los valores y limpiarlos de espacios al inicio/final con .trim()
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const email = document.getElementById('c-email').value.trim();

    // 2. Validaciones del Paso 1
    if (name.length < 4 || name.length > 20) {
        alert("El nombre debe tener entre 4 y 20 caracteres.");
        return;
    }
    // La expresión /^\d{11}$/ verifica que haya exactamente 11 dígitos numéricos
    if (!/^\d{11}$/.test(phone)) {
        alert("El teléfono personal debe contener exactamente 11 números.");
        return;
    }
    if (!email.includes('@gmail')) {
        alert("El correo electrónico debe ser formato @gmail.");
        return;
    }
    // Si pasa todas las validaciones, avanzamos
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
   
    // 1. Obtener valores del Paso 2
    const wName = document.getElementById('w-name').value.trim();
    const wDesc = document.getElementById('w-desc').value.trim();
    const wAct = document.getElementById('w-act').value.trim();
    const wType = document.getElementById('w-type').value;
    const wTel = document.getElementById('w-tel').value.trim();
    // 2. Validaciones del Paso 2
    if (wName.length < 4 || wName.length > 20) {
        alert("El nombre del taller debe tener entre 4 y 20 caracteres.");
        return;
    }

    if (wDesc.length < 4 || wDesc.length > 1000) {
        alert("La descripción debe tener entre 4 y 1000 caracteres.");
        return;
    }

    if (wAct.length < 4 || wAct.length > 1000) {
        alert("Las actividades deben tener entre 4 y 1000 caracteres.");
        return;
    }

    if (wType === 'propio') {
        const wMod = document.getElementById('w-mod').value;
        const wAula = document.getElementById('w-aula').value;
        
        // Verificamos que no sean negativos ni estén vacíos
        if (wMod < 0 || wAula < 0 || wMod === "" || wAula === "") {
            alert("El módulo y el aula no pueden ser valores negativos ni estar vacíos.");
            return;
        }
    }

    if (!/^\d{11}$/.test(wTel)) {
        alert("El teléfono de contacto del taller debe contener exactamente 11 números.");
        return;
    }

    // Leer la base de datos actual del navegador
    let db = JSON.parse(localStorage.getItem('cc_talleres')) || [];
   
    // --- LÓGICA DE GUARDADO (Si pasa todas las validaciones) ---
    const nuevo = {
        id: db.length + 1,
        name: wName,
        description: wDesc,
        category: document.getElementById('w-cat').value,
        type: wType,
        image: document.getElementById('w-img').value,
        activities: wAct.split(',').map(i => i.trim()),
        phone: wTel,
        social: document.getElementById('w-soc').value,
        locationData: wType === 'propio' ? {
            modulo: document.getElementById('w-mod').value,
            aula: document.getElementById('w-aula').value
        } : {
            address: document.getElementById('w-dir').value,
            hours: document.getElementById('w-hrs').value,
            lat: -34.4833, 
            lng: -58.7167  
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
