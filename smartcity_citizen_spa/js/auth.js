// js/auth.js

// --- FUNGSI SETUP LOGIN ---
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return; // Mencegah error jika form tidak ditemukan di layar

    loginForm.addEventListener('submit', async function(event) {
        // CHECKPOINT: Cegah browser melakukan reload halaman bawaan HTML!
        event.preventDefault(); 

        // 1. Ambil nilai dari input teks
        const usernameInput = document.getElementById('loginUsername').value;
        const passwordInput = document.getElementById('loginPassword').value;

        // 2. Siapkan payload data
        const payload = {
            username: usernameInput,
            password: passwordInput
        };

        // 3. Panggil fungsi requestAPI (dari api.js) dengan metode POST
        const response = await requestAPI('/token/', 'POST', payload);

        // 4. Tangani respons dari server
        if (response && response.status === 200) {
            // Berhasil login! Simpan token ke localStorage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            alert('Berhasil Login!' + localStorage.getItem('access_token'));
            
            // Arahkan otomatis ke dashboard
            window.location.hash = '#dashboard'; 
        } else {
            alert('Gagal login. Periksa kembali username dan password Anda.');
        }
    });
}

// --- FUNGSI SETUP REGISTER ---
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Cegah reload

        // 1. Ambil data dari form
        const usernameInput = document.getElementById('regUsername').value;
        const emailInput = document.getElementById('regEmail').value;
        const passwordInput = document.getElementById('regPassword').value;

        const payload = {
            username: usernameInput,
            email: emailInput,
            password: passwordInput
        };

        // 2. Tembak endpoint register yang dibuat di app usermanagement (Lab 10)
        const response = await requestAPI('/register/', 'POST', payload);

        if (response && response.status === 201) { // 201 adalah kode HTTP Created
            alert('Registrasi berhasil! Silakan login.');
            window.location.hash = '#login'; // Arahkan ke halaman login
        } else {
            // Menampilkan pesan error spesifik dari backend (jika ada)
            alert('Registrasi gagal. Username mungkin sudah dipakai.');
            console.log(response.data);
        }
    });
}