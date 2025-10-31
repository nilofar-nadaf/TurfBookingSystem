document.addEventListener('DOMContentLoaded', () => {
    addPasswordValidation();
});

// ✅ Password match validation
function addPasswordValidation() {
    const form = document.getElementById('registerForm');
    if (!form) {
        console.error("Error: Registration form with ID 'registerForm' not found.");
        return;
    }

    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');

    // Create small error message element for password mismatch
    const errorText = document.createElement('div');
    errorText.classList.add('error-text');
    // Insert the error text after the confirm password input's parent div
    confirmInput.parentElement.after(errorText); 

    form.addEventListener('submit', (e) => {
        // Clear previous error states
        passwordInput.classList.remove('input-error');
        confirmInput.classList.remove('input-error');
        errorText.textContent = '';


        if (passwordInput.value !== confirmInput.value) {
            // CRITICAL: Prevent submission ONLY if validation fails
            e.preventDefault(); 
            errorText.textContent = '⚠️ Passwords do not match!';
            passwordInput.classList.add('input-error');
            confirmInput.classList.add('input-error');
        } else {
            // Passwords match. Allow the form to submit normally to the Spring Boot controller.
            errorText.textContent = '';
            passwordInput.classList.remove('input-error');
            confirmInput.classList.remove('input-error');

            // Do NOT call e.preventDefault() here.
        }
    });
}