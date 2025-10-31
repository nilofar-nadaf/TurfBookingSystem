function processBooking() {
    if (totalAmount.textContent === '₹0.00' || totalAmount.textContent.includes('Invalid')) {
        alert("⚠️ Please select a valid booking duration (Start and End Time) before securing your booking.");
        return;
    }
    
    // --- CHANGE STARTS HERE ---
    
    // In a real application, a successful payment confirmation would happen here.
    
    // For the front-end demo, we simulate success and redirect to the confirmation page.
    window.location.href = "@{/bookConfirm}"; 
    
    // --- CHANGE ENDS HERE ---
}