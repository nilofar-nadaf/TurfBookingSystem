document.addEventListener('DOMContentLoaded', () => {
    checkRoleAndToggleForm();
    addPasswordValidation();
});

function checkRoleAndToggleForm() {
    const selectedRole = sessionStorage.getItem('userSelectedRole');
    const registerForm = document.getElementById('registerForm');
    // Select all inputs and the button inside the form
    const formInputs = registerForm.querySelectorAll('input, button'); 
    const messageElement = document.getElementById('registerMessage');

    if (selectedRole) {
        // Enable form
        registerForm.classList.remove('register-form-disabled');
        messageElement.classList.add('ready');
        // Enable all inputs and the button
        formInputs.forEach(el => el.removeAttribute('disabled')); 
        messageElement.textContent = `✅ Role '${selectedRole}' selected. You can now register.`;
    } else {
        // Disable form
        registerForm.classList.add('register-form-disabled');
        messageElement.classList.remove('ready');
        // Disable all inputs and the button
        formInputs.forEach(el => el.setAttribute('disabled', 'true')); 
        messageElement.textContent = 'Please select your role first.';
    }
}

// ✅ Password match validation
function addPasswordValidation() {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');

    // Create small error message element for password mismatch
    const errorText = document.createElement('div');
    errorText.classList.add('error-text');
    // Insert the error text after the confirm password input's parent div
    confirmInput.parentElement.after(errorText); 

    form.addEventListener('submit', (e) => {
        // Only prevent default if the form is NOT disabled
        if (form.classList.contains('register-form-disabled')) {
            e.preventDefault();
            return;
        }
        
        e.preventDefault();

        // Clear previous error states
        passwordInput.classList.remove('input-error');
        confirmInput.classList.remove('input-error');
        errorText.textContent = '';


        if (passwordInput.value !== confirmInput.value) {
            errorText.textContent = '⚠️ Passwords do not match!';
            passwordInput.classList.add('input-error');
            confirmInput.classList.add('input-error');
        } else {
            errorText.textContent = '';
            passwordInput.classList.remove('input-error');
            confirmInput.classList.remove('input-error');

            alert('🎉 Registration successful!');
            // In a real application, you would send the form data to the server here.
        }
    });
}