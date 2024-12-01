// URL de la API de XUI ONE
const API_URL = "http://161.132.41.174/api/v1";
let token = localStorage.getItem('token'); // Obtiene el token guardado en el almacenamiento local

document.addEventListener("DOMContentLoaded", function () {
    // Si ya hay un token, cargamos los contenidos
    if (token) {
        showMainPage();
        fetchChannels();
        fetchVOD();
    } else {
        // Redirigimos al login si no hay token
        if (window.location.pathname !== '/login.html') {
            window.location.href = '/login.html';
        }
    }

    // Eventos de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }

    // Evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function login(username, password) {
    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            showMainPage();
            fetchChannels();
            fetchVOD();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error de autenticación:', error);
    });
}

function showMainPage() {
    document.getElementById('app').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

function fetchChannels() {
    fetch(`${API_URL}/iptv/channels`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const channelList = document.getElementById('channelList');
        data.channels.forEach(channel => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${channel.url}" target="_blank">${channel.name}</a>`;
            channelList.appendChild(li);
        });
    })
    .catch(error => console.error('Error al cargar canales:', error));
}

function fetchVOD() {
    fetch(`${API_URL}/vod/contents`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const vodList = document.getElementById('vodList');
        data.contents.forEach(content => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${content.url}" target="_blank">${content.title}</a>`;
            vodList.appendChild(li);
        });
    })
    .catch(error => console.error('Error al cargar VOD:', error));
}
