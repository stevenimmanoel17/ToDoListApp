// Variabel untuk menyimpan input passcode sementara
let currentPasscode = "";
const MAX_LENGTH = 6; // Sesuai dengan desain (6 titik)

// Fungsi untuk memperbarui tampilan titik (putih / kosong)
function updateIndicators() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index < currentPasscode.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Fungsi ketika angka di keypad ditekan
function pressKey(num) {
    if (currentPasscode.length < MAX_LENGTH) {
        currentPasscode += num;
        updateIndicators();
    }
}

// Fungsi ketika tombol hapus (silang) ditekan
function deleteKey() {
    if (currentPasscode.length > 0) {
        currentPasscode = currentPasscode.slice(0, -1);
        updateIndicators();
    }
}

// Fungsi memverifikasi Passcode ke LocalStorage ketika menekan "OK"
function submitPasscode() {
    if (currentPasscode.length !== MAX_LENGTH) {
        alert("Harap masukkan 6 digit Passcode.");
        return;
    }

    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        
        if (userData.passcode === currentPasscode) {
            window.location.href = 'homepage.html';
        } else {
            // Ambil elemen pembungkus titik-titik
            const indicators = document.getElementById('indicators');
            
            // Tambahkan class animasi getar
            indicators.classList.add('shake-animation');
            
            // Tunggu animasi selesai (400ms), lalu hapus class dan kosongkan passcode
            setTimeout(() => {
                indicators.classList.remove('shake-animation');
                currentPasscode = "";
                updateIndicators();
            }, 400);
        }
    } else {
        alert("Data pengguna tidak ditemukan. Silakan Sign Up terlebih dahulu.");
        window.location.href = 'signup.html';
    }
}