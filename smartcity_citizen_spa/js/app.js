// js/app.js

// Variabel global untuk menyimpan instansiasi modal agar bisa dipanggil fungsi lain
let reportModalInstance = null;

// Status data untuk aplikasi SPA
let allReports = [];         // Menyimpan data laporan untuk halaman aktif
let currentTab = 'my_reports'; // Tab aktif saat ini: 'my_reports' atau 'feed'
let currentPage = 1;         // Halaman aktif saat ini
let totalPages = 1;          // Total halaman
let editingReportId = null;  // ID laporan yang sedang diedit (null jika membuat laporan baru)

/**
 * Fungsi untuk mengambil rekap status laporan milik warga secara keseluruhan (tanpa paginasi).
 * Dipanggil secara terpisah menggunakan limit besar (page_size=1000) agar penghitungan stats akurat.
 */
async function loadSummaryStats() {
    const response = await requestAPI('/report/?tab=my_reports&page_size=1000', 'GET');
    if (response && response.status === 200) {
        const myReports = response.data.results || [];
        
        const draftCount = myReports.filter(r => r.status === 'DRAFT').length;
        const reportedCount = myReports.filter(r => r.status === 'REPORTED').length;
        const verifiedCount = myReports.filter(r => r.status === 'VERIFIED').length;
        const inProgressCount = myReports.filter(r => r.status === 'IN_PROGRESS').length;
        const resolvedCount = myReports.filter(r => r.status === 'RESOLVED').length;

        const summaryStats = document.getElementById('summaryStats');
        if (summaryStats) {
            summaryStats.innerHTML = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-pencil-square text-secondary me-2"></i>Draf</span> 
                    <span class="badge bg-secondary rounded-pill">${draftCount}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-send-fill text-warning me-2"></i>Diajukan</span> 
                    <span class="badge bg-warning text-dark rounded-pill">${reportedCount}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-patch-check-fill text-primary me-2"></i>Diverifikasi</span> 
                    <span class="badge bg-info text-dark rounded-pill">${verifiedCount}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-gear-fill text-info me-2"></i>Diproses</span> 
                    <span class="badge bg-primary rounded-pill">${inProgressCount}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-check-circle-fill text-success me-2"></i>Selesai</span> 
                    <span class="badge bg-success rounded-pill">${resolvedCount}</span>
                </li>
            `;
        }
    }
}

/**
 * Fungsi untuk mengambil data dashboard berdasarkan tab aktif dan nomor halaman.
 */
async function loadDashboardData(tab = currentTab, page = currentPage) {
    currentTab = tab;
    currentPage = page;

    // 1. Ambil data terpaginasi dari API (backend menangani filter dan sorting by updated_at)
    const response = await requestAPI(`/report/?tab=${tab}&page=${page}`, 'GET');
    
    if (response && response.status === 200) {
        allReports = response.data.results || [];
        const count = response.data.count || 0;
        totalPages = Math.ceil(count / 10) || 1;

        // 2. Perbarui Rekap Status Laporan (seluruh laporan milik user)
        loadSummaryStats();

        // 3. Render kartu laporan dan kontrol paginasi
        renderList();
        renderPagination();
    } else {
        const listContainer = document.getElementById('listContainer');
        if (listContainer) {
            listContainer.innerHTML = `
                <div class="col-12 text-center text-muted p-5">
                    <i class="bi bi-exclamation-triangle fs-1"></i><p>Gagal memuat data laporan.</p>
                </div>
            `;
        }
        const paginationContainer = document.getElementById('paginationContainer');
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
    }
}

/**
 * Fungsi untuk merender daftar laporan ke dalam kartu HTML.
 */
function renderList() {
    const listContainer = document.getElementById('listContainer');
    if (!listContainer) return;
    
    listContainer.innerHTML = ''; // Kosongkan kontainer

    // 1. Jika data kosong
    if (allReports.length === 0) {
        listContainer.innerHTML = `<div class="col-12 text-center p-5 text-muted bg-white rounded shadow-sm">Belum ada laporan di tab ini.</div>`;
        return;
    }

    // 2. Render Kartu
    allReports.forEach(report => {
        const card = document.createElement('div');
        card.className = 'col';

        // Logika pembuatan progress bar untuk laporan non-draft
        let progressBarHTML = '';
        if (report.status !== 'DRAFT') {
            let progressPercent = 0;
            let progressBarClass = 'bg-secondary';
            let progressLabel = 'Draf';
            
            switch (report.status) {
                case 'REPORTED':
                    progressPercent = 25;
                    progressBarClass = 'bg-warning text-dark';
                    progressLabel = 'Diajukan (25%)';
                    break;
                case 'VERIFIED':
                    progressPercent = 50;
                    progressBarClass = 'bg-info text-dark';
                    progressLabel = 'Diverifikasi (50%)';
                    break;
                case 'IN_PROGRESS':
                    progressPercent = 75;
                    progressBarClass = 'bg-primary';
                    progressLabel = 'Diproses (75%)';
                    break;
                case 'RESOLVED':
                    progressPercent = 100;
                    progressBarClass = 'bg-success';
                    progressLabel = 'Selesai (100%)';
                    break;
            }
            
            progressBarHTML = `
                <div class="mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="fw-bold text-muted" style="font-size: 0.72rem;">Progress Laporan:</small>
                        <small class="fw-bold text-primary" style="font-size: 0.72rem;">${progressLabel}</small>
                    </div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated ${progressBarClass}" 
                             role="progressbar" 
                             style="width: ${progressPercent}%;" 
                             aria-valuenow="${progressPercent}" 
                             aria-valuemin="0" 
                             aria-valuemax="100"></div>
                    </div>
                </div>
            `;
        }

        // Tampilkan tombol Edit Draft jika status laporan adalah DRAFT dan milik sendiri
        let editButtonHTML = '';
        if (report.status === 'DRAFT' && report.is_owner) {
            editButtonHTML = `
                <button class="btn btn-outline-primary btn-sm w-100 fw-bold mt-2 py-1.5 small" onclick="editDraft(${report.id})">
                    <i class="bi bi-pencil-square me-1"></i>Edit & Ajukan Laporan
                </button>
            `;
        }

        // Tentukan warna badge status laporan
        let badgeClass = 'bg-secondary';
        if (report.status === 'REPORTED') badgeClass = 'bg-warning text-dark';
        else if (report.status === 'VERIFIED') badgeClass = 'bg-info text-dark';
        else if (report.status === 'IN_PROGRESS') badgeClass = 'bg-primary';
        else if (report.status === 'RESOLVED') badgeClass = 'bg-success';

        card.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge ${badgeClass}">${report.status}</span>
                            <span class="text-muted small" style="font-size: 0.72rem;">${report.category}</span>
                        </div>
                        <h5 class="card-title fw-bold">${report.title}</h5>
                        <p class="card-text small text-muted mb-3">${report.description}</p>
                    </div>
                    <div>
                        <hr class="my-2">
                        <p class="small mb-0"><strong>Lokasi:</strong> ${report.location}</p>
                        <p class="small mb-0"><strong>Oleh:</strong> ${report.reporter_name}</p>
                        ${progressBarHTML}
                        ${editButtonHTML}
                    </div>
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

/**
 * Fungsi untuk membuka data draft laporan ke dalam form modal agar bisa dimodifikasi.
 */
window.editDraft = function(id) {
    const report = allReports.find(r => r.id === id);
    if (!report) return;

    // Masukkan data ke input form modal
    document.getElementById('inputTitle').value = report.title;
    document.getElementById('inputCategory').value = report.category;
    document.getElementById('inputLocation').value = report.location;
    document.getElementById('inputDescription').value = report.description;

    // Set status sedang mengedit draft laporan tertentu
    editingReportId = id;

    // Buka modal secara terprogram
    if (reportModalInstance) {
        // Ganti judul modal untuk menandakan sedang mengedit
        document.getElementById('reportModalLabel').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Draft Laporan';
        reportModalInstance.show();
    }
};

/**
 * Fungsi untuk merender elemen kontrol navigasi halaman (pagination).
 */
function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let buttonsHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm mb-0">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <button class="page-link" onclick="changePage(${currentPage - 1})">Sebelumnya</button>
                </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        buttonsHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <button class="page-link" onclick="changePage(${i})">${i}</button>
            </li>
        `;
    }

    buttonsHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <button class="page-link" onclick="changePage(${currentPage + 1})">Selanjutnya</button>
                </li>
            </ul>
        </nav>
    `;

    container.innerHTML = buttonsHTML;
}

/**
 * Fungsi global untuk berpindah halaman.
 */
window.changePage = function(page) {
    if (page < 1 || page > totalPages) return;
    loadDashboardData(currentTab, page);
};

/**
 * Fungsi untuk menghidupkan tombol modal form laporan baru dan event tab.
 */
function setupDashboardEvents() {
    const btnBukaModal = document.getElementById('btnBukaModal');
    const modalElement = document.getElementById('reportModal');
    const reportForm = document.getElementById('reportForm');

    if (btnBukaModal && modalElement) {
        // 1. Hubungkan elemen HTML modal dengan library Bootstrap JS
        reportModalInstance = new bootstrap.Modal(modalElement);

        // 2. Pasang event listener klik pada tombol "Buat Laporan Baru"
        btnBukaModal.addEventListener('click', function() {
            editingReportId = null; // Reset ID edit (mode membuat baru)
            if (reportForm) reportForm.reset(); // Kosongkan inputan
            document.getElementById('reportModalLabel').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Buat Laporan Baru';
            reportModalInstance.show(); // Munculkan pop-up modal
        });
    }

    // Logika Tab Navigasi
    const tabLaporanSaya = document.getElementById('tabLaporanSaya');
    const tabFeedKota = document.getElementById('tabFeedKota');

    if (tabLaporanSaya && tabFeedKota) {
        tabLaporanSaya.addEventListener('click', () => {
            tabLaporanSaya.classList.add('active', 'text-primary');
            tabLaporanSaya.classList.remove('text-muted');
            tabFeedKota.classList.remove('active', 'text-primary');
            tabFeedKota.classList.add('text-muted');
            loadDashboardData('my_reports', 1);
        });

        tabFeedKota.addEventListener('click', () => {
            tabFeedKota.classList.add('active', 'text-primary');
            tabFeedKota.classList.remove('text-muted');
            tabLaporanSaya.classList.remove('active', 'text-primary');
            tabLaporanSaya.classList.add('text-muted');
            loadDashboardData('feed', 1);
        });
    }
}

/**
 * Fungsi pembantu untuk memperbarui tampilan Navbar secara dinamis.
 */
function updateNavbarUI() {
    const navMenus = document.getElementById('nav-menus');
    if (!navMenus) return;

    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username') || 'Warga';
    if (token) {
        navMenus.innerHTML = `
            <span class="text-white me-3 small"><i class="bi bi-person-circle me-1"></i>Halo, ${username}!</span>
            <button class="btn btn-outline-light btn-sm fw-bold" id="btnLogout"><i class="bi bi-box-arrow-right me-1"></i>Keluar</button>
        `;
        document.getElementById('btnLogout').addEventListener('click', function() {
            localStorage.clear(); // Hapus token saat keluar
            window.location.hash = '#login';
        });
    } else {
        navMenus.innerHTML = `
            <a href="#login" class="btn btn-outline-light btn-sm fw-bold me-2">Masuk</a>
            <a href="#register" class="btn btn-light btn-sm fw-bold text-primary">Daftar</a>
        `;
    }
}

/**
 * Fungsi untuk menangani pengiriman form laporan (membuat baru atau memperbarui draft).
 */
function setupReportForm() {
    const btnDraft = document.getElementById('btnDraft');
    const btnSubmit = document.getElementById('btnSubmit');
    const reportForm = document.getElementById('reportForm');

    if (!btnDraft || !btnSubmit || !reportForm) return;

    async function kirimLaporan(status) {
        // 1. CEK TOKEN SEBELUM KIRIM
        const token = localStorage.getItem('access_token');
        console.log("Token yang terbaca saat akan kirim:", token);
        
        if (!token) {
            alert("Token tidak ditemukan! Anda harus login ulang.");
            window.location.hash = '#login';
            return;
        }

        // 2. AMBIL DATA FORM
        const payload = {
            title: document.getElementById('inputTitle').value,
            category: document.getElementById('inputCategory').value,
            location: document.getElementById('inputLocation').value,
            description: document.getElementById('inputDescription').value,
            status: status
        };

        console.log("Data yang akan dikirim:", payload);

        // 3. KIRIM KE API (Gunakan PUT jika sedang mengedit draft lama, POST jika baru)
        let response;
        if (editingReportId) {
            response = await requestAPI(`/report/${editingReportId}/`, 'PUT', payload);
        } else {
            response = await requestAPI('/report/', 'POST', payload);
        }
        
        console.log("Respons dari server:", response);
 
        if (response && (response.status === 200 || response.status === 201)) {
            alert(editingReportId ? 'Laporan berhasil diperbarui!' : 'Laporan berhasil disimpan sebagai ' + status);
            editingReportId = null; // Reset ID edit kembali ke null
            reportModalInstance.hide();
            reportForm.reset();
            loadDashboardData(); // Reload data dashboard
        } else {
            alert("Gagal menyimpan laporan. Cek Console (F12) untuk detail error.");
        }
    }

    // Pasang listener klik
    btnDraft.addEventListener('click', () => {
        console.log("Tombol Draf ditekan");
        kirimLaporan('DRAFT');
    });

    btnSubmit.addEventListener('click', () => {
        console.log("Tombol Ajukan ditekan");
        kirimLaporan('REPORTED');
    });
}

// Panggil fungsi-fungsi setup saat file app.js dimuat
document.addEventListener('DOMContentLoaded', () => {
    setupReportForm();
});