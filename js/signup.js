// Fungsi untuk mengubah tipe input antara 'password' dan 'text'
const handleToggle = (inputSelector, iconSelector) => {
  const input = document.querySelector(inputSelector)
  const icon = document.querySelector(iconSelector)

  if (input && icon) {
    icon.addEventListener('click', () => {
      const isSecret = input.type === 'text'
      input.type = isSecret ? 'password' : 'text'
      icon.style.opacity = isSecret ? '0.5' : '1'
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  handleToggle('#passcode', '#eye-passcode')
  handleToggle('#verif-passcode', '#eye-verif')
})

// Fungsi mengambil data isian formulir dan menyimpannya
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passcodeInput = document.getElementById('passcode').value;
    const verifInput = document.getElementById('verif-passcode').value;

    if (passcodeInput !== verifInput) {
        alert('Passcode tidak cocok. Silakan periksa kembali.');
        return;
    }

    const existingData = localStorage.getItem('userData');
    
    if (existingData) {
        const parsedData = JSON.parse(existingData);
        
        if (parsedData.email === emailInput) {
            const failedOverlay = document.getElementById('failedOverlay');
            failedOverlay.classList.add('show');
            
            setTimeout(() => {
                failedOverlay.classList.remove('show');
            }, 2500);
            
            return; 
        }
    }

    const userData = {
        email: emailInput,
        passcode: passcodeInput
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));

    const overlay = document.getElementById('successOverlay');
    overlay.classList.add('show');

    setTimeout(() => {
        window.location.href = 'passcode.html';
    }, 2500);
});