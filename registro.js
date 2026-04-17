const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const title = document.getElementById('form-title');

function nextStep() {
    clearErrors(); // Borramos errores anteriores antes de volver a validar
    let isValid = true; 
   
    // 1. Obtener los valores
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const email = document.getElementById('c-email').value.trim();

    // 2. Validaciones
    if (name.length < 4 || name.length > 20) {
       showError('c-name', 'err-c-name', 'Los nombres deben tener entre 4 y 20 caracteres.');
       isValid = false;
    }
    
    if (phone.toString().length > 0) {
       showError('c-phone', 'err-c-phone', 'Debe ingresar un numero de teléfono');
       isValid = false;
    }

    const regexCorreo = /^[^\s@]+@gmail\.com$/;
    if (!regexCorreo.test(email)) {
       showError('c-email', 'err-c-email', 'El correo debe ser @gmail.com y tener al menos un carácter antes del @.');
       isValid = false;
    }
   if (isValid) {
      step1.style.display = 'none';
      step2.style.display = 'block';
      title.textContent = "Paso 2: Datos del Taller";
    }
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


async function guardarTaller(e) {
    clearErrors();
    let isValid = true; 
    e.preventDefault();
   
    // 1. Obtener valores del Paso 2
    const wImg = document.getElementById('w-img').value.trim();
    const wName = document.getElementById('w-name').value.trim();
    const wDesc = document.getElementById('w-desc').value.trim();
    const wAct = document.getElementById('w-act').value.trim();
    const wType = document.getElementById('w-type').value;
    const wTel = document.getElementById('w-tel').value.trim();
    const wCat = document.getElementById('w-cat').value;
    const wSoc = document.getElementById('w-soc').value;
    
    // 2. Validaciones del Paso 2
    if(wImg === "") {
       showError('w-img', 'err-w-img', 'Por favor, ingresa la URL de una foto.');
       isValid = false;
    }
   
    if (wName.length < 4 || wName.length > 20) {
       showError('w-name', 'err-w-name', 'El nombre deben tener entre 4 y 20 caracteres.');
       isValid = false;
    }

    if (wDesc.length < 4 || wDesc.length > 1000) {
       showError('w-desc', 'err-w-desc', 'La descripción debe tener entre 4 y 1000 caracteres.');
       isValid = false;
    }

    if (wAct.length < 4 || wAct.length > 1000) {
       showError('w-act', 'err-w-act', 'Las actividades deben tener entre 4 y 1000 caracteres.');
       isValid = false;
    }

    if (wCat === ""){
       showError('w-cat', 'err-w-cat', 'Por favor, seleccione una opción de la lista.');
       isValid = false;
    }

    if (wType === 'propio') {
        const wMod = document.getElementById('w-mod').value;
        const wAula = document.getElementById('w-aula').value;
        
        if (wMod < 1 || wMod === "") {
           showError('w-mod', 'err-w-mod', 'El módulo no pueden ser un valor negativo ni valor igual a cero.');
           isValid = false;
        }
       if (wAula < 1 || wAula === "") {
           showError('w-aula', 'err-w-aula', 'El aula no pueden ser un valor negativo ni valor igual a cero.');
           isValid = false;
        }
    }

    if (wTel.toString().length > 0) {
        showError('w-tel', 'err-w-tel', 'Debe ingresar un numero de teléfono');
        isValid = false;
    }
    
    if (wSoc === "") {
        showError('w-soc', 'err-w-soc', 'Debe indicar su red social.');
        isValid = false;
    }
    
    if (isValid) {
        let latFinal = -34.5231018;
        let lngFinal = -58.7030525;
        let dirFinal = "Universidad Nacional de General Sarmiento";

        // 1. Normalización con USIG (Solo si es particular)
        if (wType === 'particular') {
            const wDir = document.getElementById('w-dir').value.trim();
            dirFinal = wDir; // Por si falla USIG, guardamos lo que escribió el usuario

            try {
                const url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${wDir}`;
                const res = await fetch(url);
                const data = await res.json();
                
                if (data.direccionesNormalizadas && data.direccionesNormalizadas.length > 0) {
                    latFinal = parseFloat(data.direccionesNormalizadas[0].coordenadas.y);
                    lngFinal = parseFloat(data.direccionesNormalizadas[0].coordenadas.x);
                    dirFinal = data.direccionesNormalizadas[0].direccion; // Dirección oficial
                } else {
                    alert("Aviso: USIG no reconoció la dirección exacta. Se guardará tal como la escribiste.");
                }
            } catch (error) {
                console.error("Error conectando con USIG al registrar:", error);
            }
        }

        let db = JSON.parse(localStorage.getItem('cc_talleres')) || [];
        const nuevo = {
            name: wName,
            description: wDesc,
            category: wCat,
            type: wType,
            image: wImg,
            activities: wAct.split(',').map(i => i.trim()),
            phone: wTel,
            social: document.getElementById('w-soc').value,
            locationData: wType === 'propio' ? {
                // parseInt asegura que enviamos números, no texto, a la BD
                modulo: parseInt(document.getElementById('w-mod').value) || null,
                aula: parseInt(document.getElementById('w-aula').value) || null,
                address: dirFinal,
                hours: document.getElementById('w-hrs').value,
                lat: latFinal,
                lng: lngFinal
            } : {
                address: dirFinal,
                hours: document.getElementById('w-hrs').value,
                lat: latFinal,
                lng: lngFinal
            }
         };
        
       db.push(nuevo);
       localStorage.setItem('cc_talleres', JSON.stringify(db)); 
       
       alert("¡Taller registrado con éxito!");
       
       // Resetear formulario y volver al paso 1
       document.getElementById('reg-form').reset();
       prevStep();
       toggleFields();   
     }
}

 // Funciones auxiliares 
 function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);
    
    input.classList.add('input-error'); // Pinta el borde rojo
    errorSpan.textContent = message;    // Escribe el mensaje
    errorSpan.style.display = 'block';  // Lo hace visible
 }

 function clearErrors() {
    // Limpia todos los bordes rojos
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    // Oculta todos los textos de error
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
 }
