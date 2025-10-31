document.addEventListener('DOMContentLoaded', () => {
    // Initial call to ensure all turfs are visible on load
    filterTurfs();
});
// Function to handle the Book Now click and pass data via URL
		function goToBooking(card) {
		    const turfName = encodeURIComponent(card.getAttribute('data-name'));
		    const turfLocation = encodeURIComponent(card.getAttribute('data-location'));
		    const turfPrice = encodeURIComponent(card.getAttribute('data-price'));

		    // Redirect to Spring Boot controller endpoint
		    window.location.href = `/bookConfirm?name=${turfName}&location=${turfLocation}&price=${turfPrice}`;
		}
/**
 * Filters the turf cards based on the input from the Name, Location, and Type filters.
 */
function filterTurfs() {
    const filterNameInput = document.getElementById('filterName');
    const filterLocationInput = document.getElementById('filterLocation');
    const filterTypeSelect = document.getElementById('filterType');
    const turfCards = document.querySelectorAll('.turf-card');
    const noResultsMessage = document.getElementById('noResultsMessage');
    let foundResults = false;

    // Normalize search terms for case-insensitive matching
    const nameSearch = filterNameInput.value.toLowerCase().trim();
    const locationSearch = filterLocationInput.value.toLowerCase().trim();
    const typeSearch = filterTypeSelect.value.toLowerCase(); // Already an exact value or empty string

    turfCards.forEach(card => {
        // Get the data attributes from the card
        const turfName = card.getAttribute('data-name').toLowerCase();
        const turfLocation = card.getAttribute('data-location').toLowerCase();
        const turfType = card.getAttribute('data-type').toLowerCase();

        // Check if the card matches all filter criteria
        const nameMatch = turfName.includes(nameSearch);
        const locationMatch = turfLocation.includes(locationSearch);
        // The type filter is an exact match unless the search is "All Turf Types" (empty string)
        const typeMatch = (typeSearch === "" || turfType === typeSearch);

        if (nameMatch && locationMatch && typeMatch) {
            // Show the card
            card.style.display = 'flex';
            foundResults = true;
        } else {
            // Hide the card
            card.style.display = 'none';
        }
    });

    // Toggle the "No Results" message
    if (noResultsMessage) {
        if (foundResults) {
            noResultsMessage.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'block';
        }
    }
}