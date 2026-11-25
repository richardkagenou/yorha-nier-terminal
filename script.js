// 0. SINTETIZADOR DE SONIDO UI (EFECTO INTERFAZ YORHA SIN ARCHIVOS MP3)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq = 620, duration = 0.05) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// 1. PANTALLA DE ARRANQUE (BOOT SEQUENCE)
window.addEventListener('DOMContentLoaded', () => {
    const progress = document.getElementById('boot-progress');
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');

    setTimeout(() => { progress.style.width = '45%'; bootLog.textContent = 'VERIFICANDO CAJA NEGRA... OK'; }, 250);
    setTimeout(() => { progress.style.width = '85%'; bootLog.textContent = 'CONECTANDO CON EL BÚNKER...'; }, 600);
    setTimeout(() => {
        progress.style.width = '100%';
        bootScreen.classList.add('hidden');
        typeWriter();
    }, 1000);
});

// 2. NAVEGACIÓN ENTRE PANTALLAS
const navButtons = document.querySelectorAll('.nav-btn');
const screens = document.querySelectorAll('.screen');

function switchScreen(targetId) {
    playBeep(740, 0.06);
    screens.forEach(s => s.classList.remove('active'));
    navButtons.forEach(b => b.classList.remove('active'));

    document.getElementById(targetId).classList.add('active');
    const activeBtn = document.querySelector(`[data-target="${targetId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

navButtons.forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.getAttribute('data-target')));
});

// 3. RELOJ EN TIEMPO REAL
setInterval(() => {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString('es-ES');
}, 1000);

// 4. EFECTO MÁQUINA DE ESCRIBIR
const introText = "Enlace táctico establecido en modo oscuro. Todo lo que vive está diseñado para terminar. Estamos perpetuamente atrapados en una espiral interminable de vida y muerte.";
let charIndex = 0;

function typeWriter() {
    const output = document.getElementById('typing-output');
    if (charIndex < introText.length) {
        output.textContent += introText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 22);
    }
}

// 5. DATOS DE ANDROIDES YORHA
const unitsData = {
    "2b": {
        name: "YoRHa No.2 Type B (2B)",
        role: "CLASE: COMBATE DE INFANTERÍA",
        weapon: "ARMA: VIRTUOUS CONTRACT",
        desc: "Androide de combate multipropósito desplegado en la 14.ª Guerra de las Máquinas. Diseñada para el combate cuerpo a cuerpo de alta precisión y ejecución silenciosa.",
        atk: 92, hack: 45, spd: 88
    },
    "9s": {
        name: "YoRHa No.9 Type S (9S)",
        role: "CLASE: ESCÁNER DE INTELIGENCIA",
        weapon: "ARMA: CRUEL OATH",
        desc: "Unidad especializada en misiones de reconocimiento. Posee la capacidad de infiltrarse y destruir redes de máquinas mediante hackeo neuronal directo.",
        atk: 54, hack: 99, spd: 82
    },
    "a2": {
        name: "YoRHa Type A No.2 (A2)",
        role: "CLASE: PROTOTIPO ATACANTE",
        weapon: "ARMA: TYPE-4O SWORD",
        desc: "Modelo prototipo de primera generación. Puede activar el Modo Berserker sobrecargando su núcleo para multiplicar su daño ofensivo.",
        atk: 98, hack: 20, spd: 96
    },
    "commander": {
        name: "Comandante White",
        role: "CLASE: MANDO ORBITAL DEL BÚNKER",
        weapon: "AUTORIZACIÓN: NIVEL OMEGA",
        desc: "Directora suprema de la base orbital YoRHa. Coordina todas las operaciones tácticas entre el Consejo de la Humanidad y las tropas en la Tierra.",
        atk: 75, hack: 85, spd: 78
    }
};

document.querySelectorAll('.unit-card').forEach(card => {
    card.addEventListener('click', () => {
        playBeep(520, 0.05);
        document.querySelectorAll('.unit-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const d = unitsData[card.getAttribute('data-unit')];
        document.getElementById('u-name').textContent = d.name;
        document.getElementById('u-class').textContent = d.role;
        document.getElementById('u-weapon').textContent = d.weapon;
        document.getElementById('u-desc').textContent = d.desc;

        document.getElementById('bar-atk').style.width = d.atk + '%';
        document.getElementById('val-atk').textContent = d.atk + '%';
        document.getElementById('bar-hack').style.width = d.hack + '%';
        document.getElementById('val-hack').textContent = d.hack + '%';
        document.getElementById('bar-spd').style.width = d.spd + '%';
        document.getElementById('val-spd').textContent = d.spd + '%';
    });
});

// 6. DIRECTIVAS Y MISIONES (FILTRO + CAMBIO DE ESTADO + CREACIÓN)
const missionsContainer = document.getElementById('missions-container');

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playBeep(600, 0.04);
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        document.querySelectorAll('.mission-item').forEach(item => {
            item.style.display = (filter === 'all' || item.getAttribute('data-status') === filter) ? 'flex' : 'none';
        });
    });
});

// Permitir cambiar estado de misión al hacer clic en su etiqueta
missionsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-status')) {
        playBeep(820, 0.05);
        const item = e.target.closest('.mission-item');
        const isActiva = item.getAttribute('data-status') === 'activa';
        item.setAttribute('data-status', isActiva ? 'completada' : 'activa');
        e.target.textContent = isActiva ? 'COMPLETADA' : 'ACTIVA';
        e.target.className = isActiva ? 'badge done toggle-status' : 'badge active toggle-status';
    }
});

document.getElementById('add-mission-form').addEventListener('submit', (e) => {
    e.preventDefault();
    playBeep(900, 0.07);
    const title = document.getElementById('mission-title').value;
    const desc = document.getElementById('mission-desc').value;

    const item = document.createElement('div');
    item.className = 'mission-item';
    item.setAttribute('data-status', 'activa');
    item.innerHTML = `
        <div>
            <h4>${title.toUpperCase()}</h4>
            <p>${desc}</p>
        </div>
        <button class="badge active toggle-status">ACTIVA</button>
    `;
    missionsContainer.prepend(item);
    e.target.reset();
});

// 7. SIMULADOR DE CAJA NEGRA (PANTALLA 4)
let corruption = 15;
const consoleBox = document.getElementById('hack-console');
const corrBar = document.getElementById('corruption-bar');
const corrText = document.getElementById('corruption-percent');

function addLog(msg, isError = false) {
    const p = document.createElement('p');
    if (isError) p.className = 'err';
    p.textContent = `> ${msg}`;
    consoleBox.appendChild(p);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

document.getElementById('btn-hack-pulse').addEventListener('click', () => {
    playBeep(320, 0.08);
    corruption = Math.min(100, corruption + 20);
    corrBar.style.width = corruption + '%';
    corrText.textContent = corruption + '%';

    if (corruption >= 80) {
        addLog(`ALERTA CRÍTICA: Corrupción al ${corruption}%. Riesgo de detonación de Caja Negra.`, true);
    } else {
        addLog(`Pulso inyectado. Infiltrando firewall de red... [${corruption}%]`);
    }
});

document.getElementById('btn-purify').addEventListener('click', () => {
    playBeep(880, 0.08);
    corruption = 10;
    corrBar.style.width = '10%';
    corrText.textContent = '10%';
    addLog('Protocolo de purga ejecutado. Núcleo estabilizado.');
});

// 8. CONTROLES DE VIDEO DE FONDO
const bgVideo = document.getElementById('bg-video');
const toggleVideoBtn = document.getElementById('toggle-video');
const muteVideoBtn = document.getElementById('mute-video');
const uploadVideoInput = document.getElementById('upload-video');

toggleVideoBtn.addEventListener('click', () => {
    if (bgVideo.paused) {
        bgVideo.play();
        toggleVideoBtn.textContent = "⏸";
    } else {
        bgVideo.pause();
        toggleVideoBtn.textContent = "▶";
    }
});

muteVideoBtn.addEventListener('click', () => {
    bgVideo.muted = !bgVideo.muted;
    muteVideoBtn.textContent = bgVideo.muted ? "🔇" : "🔊";
});

uploadVideoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        bgVideo.src = URL.createObjectURL(file);
        bgVideo.play();
        toggleVideoBtn.textContent = "⏸";
    }
});