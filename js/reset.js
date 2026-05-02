document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('emailForm');
    const newPasscodeForm = document.getElementById('newPasscodeForm');
    
    const stepEmail = document.getElementById('step-email');
    const stepPasscode = document.getElementById('step-passcode');
    
    const falseEmailOverlay = document.getElementById('falseEmailOverlay');
    const trueEmailOverlay = document.getElementById('trueEmailOverlay');
    const successPasscodeOverlay = document.getElementById('successPasscodeOverlay');

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('reset-email').value;
        const storedData = localStorage.getItem('userData');
        
        let isMatch = false;
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData.email === emailInput) {
                isMatch = true;
            }
        }

        if (isMatch) {
            trueEmailOverlay.classList.add('show');
            setTimeout(() => {
                trueEmailOverlay.classList.remove('show');
                stepEmail.classList.add('hidden');
                stepPasscode.classList.remove('hidden');
            }, 2500);
        } else {
            falseEmailOverlay.classList.add('show');
            setTimeout(() => {
                falseEmailOverlay.classList.remove('show');
            }, 2500);
        }
    });

    newPasscodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPasscodeInput = document.getElementById('new-passcode').value;
        const storedData = localStorage.getItem('userData');
        
        if (storedData) {
            const userData = JSON.parse(storedData);
            userData.passcode = newPasscodeInput;
            localStorage.setItem('userData', JSON.stringify(userData));
            
            successPasscodeOverlay.classList.add('show');
            setTimeout(() => {
                window.location.href = 'passcode.html';
            }, 2500);
        }
    });
});