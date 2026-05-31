const routes = {
    '': `
        <div class="text-center mt-5">
            <h1 class="fw-bold">Selamat Datang di Smart City Portal</h1>
            <p class="text-muted">Silakan masuk atau mendaftar untuk mengelola laporan fasilitas kota.</p>
            <a href="#login" class="btn btn-primary btn-lg mt-2">Login Warga</a>
        </div>
    `,
    '#login': `
        <div class="row justify-content-center mt-5">
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h4 class="card-title text-center fw-bold mb-4">Login Warga</h4>
                        <form id="loginForm">
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Username</label>
                                <input type="text" id="loginUsername" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Password</label>
                                <input type="password" id="loginPassword" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 fw-bold">Masuk</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    '#register': `
        <div class="row justify-content-center mt-5">
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h4 class="card-title text-center fw-bold mb-4">Daftar Akun Baru</h4>
                        <form id="registerForm">
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Username</label>
                                <input type="text" id="regUsername" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Email</label>
                                <input type="email" id="regEmail" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Password</label>
                                <input type="password" id="regPassword" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-success w-100 fw-bold">Daftar Sekarang</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    '#dashboard': `
        <div class="row g-4">
            <aside class="col-12 col-lg-2">
                <div class="card shadow-sm border-0 p-3 bg-white text-center">
                    <button class="btn btn-primary btn-lg w-100 fw-bold py-3 mb-3 shadow-sm" id="btnBukaModal">
                        <i class="bi bi-plus-circle-fill me-2"></i>Buat Laporan Baru
                    </button>
                    <div class="text-start mt-2">
                        <h6 class="text-muted fw-bold text-uppercase small">
                            <i class="bi bi-activity me-1"></i>Status Laporan Anda
                        </h6>
                        <ul class="list-group list-group-flush small mt-2" id="summaryStats">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <span><i class="bi bi-pencil-square text-secondary me-2"></i>Draf</span> 
                                <span class="badge bg-secondary rounded-pill">0</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <span><i class="bi bi-send-fill text-warning me-2"></i>Diajukan</span> 
                                <span class="badge bg-warning text-dark rounded-pill">0</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <span><i class="bi bi-gear-fill text-info me-2"></i>Diproses</span> 
                                <span class="badge bg-info text-dark rounded-pill">0</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <span><i class="bi bi-check-circle-fill text-success me-2"></i>Selesai</span> 
                                <span class="badge bg-success rounded-pill">0</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-lg-10">
                <ul class="nav nav-tabs fw-bold mb-4" id="citizenTab">
                    <li class="nav-item">
                        <button class="nav-link active text-primary" id="tabLaporanSaya">
                            <i class="bi bi-folder-fill me-2"></i>Laporan Saya
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link text-muted" id="tabFeedKota">
                            <i class="bi bi-globe-americas me-2"></i>Feed Kota (Publik)
                        </button>
                    </li>
                </ul>
                <div class="row row-cols-1 row-cols-md-2 g-4" id="listContainer">
                    <div class="col-12">
                        <div class="text-center text-muted p-5 bg-white rounded shadow-sm border border-dashed">
                            <i class="bi bi-inbox fs-1 text-light"></i>
                            <h5 class="mt-3">Selamat Datang di Dashboard!</h5>
                            <p class="small">Koneksi Fetch API dan render data laporan secara dinamis akan diimplementasikan penuh pada Lab Session 12.</p>
                        </div>
                    </div>
                </div>
                <div id="paginationContainer" class="mt-4 d-flex justify-content-center"></div>
            </section>
        </div>
    `,
};

function handleRouting() {
    const hash = window.location.hash || '';
    const contentDiv = document.getElementById('app-content');
    contentDiv.innerHTML = routes[hash] || routes[''];

    // Menghidupkan ulang Event Listener Form setelah DOM di-inject
    if (hash === '#login') setupLoginForm();
    if (hash === '#register') setupRegisterForm();

    if (hash === '#dashboard') {
        setupDashboardEvents();
        loadDashboardData();
    }
    
    updateNavbarUI();
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);