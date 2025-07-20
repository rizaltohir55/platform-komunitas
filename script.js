// Inisialisasi peta
let map;

// Fungsi untuk inisialisasi peta
function initMap() {
    // Buat peta dengan view di Indonesia
    map = L.map('map').setView([-2.5489, 118.0149], 5);
    
    // Tambahkan tile layer (peta dasar)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Fungsi untuk menampilkan proyek
async function displayProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '<div class="status-message status-loading">Memuat proyek...</div>';
    
    try {
        // Ambil data dari Supabase
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        // Kosongkan container
        container.innerHTML = '';
        
        // Cek jika tidak ada proyek
        if (!projects || projects.length === 0) {
            container.innerHTML = '<p>Belum ada proyek yang diajukan. Jadilah yang pertama!</p>';
            return;
        }
        
        // Hapus semua marker lama dari peta
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        
        // Tampilkan setiap proyek
        projects.forEach(project => {
            // Buat card proyek
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            
            // Format tanggal
            const createdAt = new Date(project.created_at);
            const formattedDate = createdAt.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            projectElement.innerHTML = `
                <h3>${project.name}</h3>
                <p><strong>Lokasi:</strong> ${project.location}</p>
                <p>${project.description}</p>
                <small>Ditambahkan pada: ${formattedDate}</small>
            `;
            container.appendChild(projectElement);
            
            // Tambahkan marker ke peta jika ada koordinat
            if (project.lat && project.lng) {
                const marker = L.marker([project.lat, project.lng]).addTo(map);
                marker.bindPopup(`<b>${project.name}</b><br>${project.location}`);
            }
        });
        
    } catch (error) {
        console.error('Error memuat proyek:', error);
        container.innerHTML = '<div class="status-message status-error">Gagal memuat proyek. Silakan coba lagi nanti.</div>';
    }
}

// Event listener untuk form submit
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Dapatkan nilai dari form
    const name = document.getElementById('project-name').value;
    const location = document.getElementById('project-location').value;
    const lat = document.getElementById('project-lat').value;
    const lng = document.getElementById('project-lng').value;
    const description = document.getElementById('project-description').value;
    const submitButton = document.getElementById('submit-button');
    
    // Validasi sederhana
    if (!name || !location || !description) {
        alert('Nama, lokasi, dan deskripsi harus diisi!');
        return;
    }
    
    try {
        // Tampilkan loading
        submitButton.disabled = true;
        submitButton.textContent = 'Mengirim...';
        
        // Kirim data ke Supabase
        const { error } = await supabase
            .from('projects')
            .insert([{ 
                name, 
                location, 
                description, 
                lat: lat ? parseFloat(lat) : null, 
                lng: lng ? parseFloat(lng) : null 
            }]);
        
        if (error) {
            throw error;
        }
        
        // Reset form
        e.target.reset();
        
        // Tampilkan pesan sukses
        alert('Proyek berhasil ditambahkan! Terima kasih atas kontribusinya.');
        
        // Perbarui tampilan proyek
        await displayProjects();
        
    } catch (error) {
        console.error('Error menambahkan proyek:', error);
        alert('Terjadi kesalahan: ' + error.message);
    } finally {
        // Reset tombol submit
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim Proyek';
    }
});

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    displayProjects();
});