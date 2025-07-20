// Data proyek sementara
let projects = [];

// Peta
let map;

// Fungsi untuk inisialisasi peta
function initMap() {
    // Set view ke Indonesia
    map = L.map('map').setView([-2.5489, 118.0149], 5);
    
    // Tambahkan tile layer dari OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Fungsi untuk menampilkan proyek
function displayProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    
    if (projects.length === 0) {
        container.innerHTML = '<p>Belum ada proyek yang diajukan. Jadilah yang pertama!</p>';
        return;
    }
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card';
        projectElement.innerHTML = `
            <h3>${project.name}</h3>
            <p><strong>Lokasi:</strong> ${project.location}</p>
            <p>${project.description}</p>
        `;
        container.appendChild(projectElement);
        
        // Tambahkan marker jika ada koordinat
        if (project.lat && project.lng) {
            const marker = L.marker([project.lat, project.lng]).addTo(map);
            marker.bindPopup(`<b>${project.name}</b><br>${project.location}`);
        }
    });
}

// Event listener untuk form
document.getElementById('project-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('project-name').value;
    const location = document.getElementById('project-location').value;
    const lat = document.getElementById('project-lat').value;
    const lng = document.getElementById('project-lng').value;
    const description = document.getElementById('project-description').value;
    
    const newProject = {
        id: Date.now(),
        name: name,
        location: location,
        description: description,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null
    };
    
    projects.push(newProject);
    displayProjects();
    
    // Reset form
    this.reset();
    alert('Proyek berhasil ditambahkan!');
});

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    displayProjects();
});