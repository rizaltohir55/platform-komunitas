// Data proyek
let projects = [];

// Peta
let map;

// Akses ke Firebase
const { db, collection, addDoc, getDocs } = window.firebase;

// Fungsi untuk inisialisasi peta
function initMap() {
    map = L.map('map').setView([-2.5489, 118.0149], 5);
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
    
    // Hapus semua marker lama
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
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

// Fungsi untuk menyimpan proyek ke Firebase
async function saveProjectToFirebase(project) {
    try {
        const docRef = await addDoc(collection(db, "projects"), project);
        console.log("Proyek tersimpan dengan ID: ", docRef.id);
        await loadProjectsFromFirebase(); // Muat ulang data setelah simpan
        return true;
    } catch (error) {
        console.error("Error menyimpan proyek: ", error);
        return false;
    }
}

// Fungsi untuk memuat proyek dari Firebase
async function loadProjectsFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        projects = [];
        querySnapshot.forEach((doc) => {
            const projectData = doc.data();
            projects.push({
                id: doc.id,
                name: projectData.name,
                location: projectData.location,
                description: projectData.description,
                lat: projectData.lat,
                lng: projectData.lng
            });
        });
        displayProjects();
    } catch (error) {
        console.log("Error memuat proyek: ", error);
    }
}

// Event listener untuk form
document.getElementById('project-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('project-name').value;
    const location = document.getElementById('project-location').value;
    const lat = document.getElementById('project-lat').value;
    const lng = document.getElementById('project-lng').value;
    const description = document.getElementById('project-description').value;
    
    const newProject = {
        name: name,
        location: location,
        description: description,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null
    };
    
    const success = await saveProjectToFirebase(newProject);
    
    if (success) {
        // Reset form
        this.reset();
        alert('Proyek berhasil ditambahkan!');
    } else {
        alert('Gagal menyimpan proyek. Silakan coba lagi.');
    }
});

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', async function() {
    initMap();
    await loadProjectsFromFirebase();
});