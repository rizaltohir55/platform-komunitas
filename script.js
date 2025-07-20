// Data proyek sementara (akan disimpan di memori browser)
let projects = [];

// Fungsi untuk menampilkan proyek
function displayProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; // Kosongkan kontainer
    
    if (projects.length === 0) {
        container.innerHTML = '<p>Belum ada proyek yang diajukan. Jadilah yang pertama!</p>';
        return;
    }
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        projectElement.innerHTML = `
            <h3>${project.name}</h3>
            <p><strong>Lokasi:</strong> ${project.location}</p>
            <p>${project.description}</p>
        `;
        container.appendChild(projectElement);
    });
}

// Fungsi untuk menambah proyek baru
document.getElementById('project-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah form refresh halaman
    
    // Ambil nilai dari form
    const name = document.getElementById('project-name').value;
    const location = document.getElementById('project-location').value;
    const description = document.getElementById('project-description').value;
    
    // Buat objek proyek baru
    const newProject = {
        id: Date.now(), // ID unik berdasarkan timestamp
        name: name,
        location: location,
        description: description
    };
    
    // Tambahkan ke array proyek
    projects.push(newProject);
    
    // Tampilkan proyek terbaru
    displayProjects();
    
    // Reset form
    this.reset();
    
    // Tampilkan pesan sukses
    alert('Proyek berhasil ditambahkan! Terima kasih atas kontribusinya.');
});

// Jalankan fungsi displayProjects saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayProjects);