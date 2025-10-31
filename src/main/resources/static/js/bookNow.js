// --- JAVASCRIPT FOR BOOKING LOGIC ---
        
        // Dynamic variable to hold the rate of the selected turf
        let TURF_RATE = 0; 
        const SERVICE_FEE_PERCENTAGE = 0.05;

        // DOM elements
        const turfNameH2 = document.getElementById('turfName');
        const turfLocationSpan = document.getElementById('turfLocation');
        const basePriceDisplay = document.getElementById('basePrice');
        const startTimeSelect = document.getElementById('startTime');
        const endTimeSelect = document.getElementById('endTime');
        const timeSlotsGrid = document.getElementById('timeSlotsGrid');
        const allSlotButtons = Array.from(timeSlotsGrid.querySelectorAll('.slot-btn'));
        const summaryDuration = document.getElementById('summaryDuration');
        const summaryRate = document.getElementById('summaryRate');
        const summaryFee = document.getElementById('summaryFee');
        const totalAmount = document.getElementById('totalAmount');
        
        /**
         * Parses URL parameters and sets the turf details.
         */
        function loadTurfDetails() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // Get data from URL, fallback to default (Power Play Arena) if missing
            const name = urlParams.get('name') || 'Power Play Arena';
            const location = urlParams.get('location') || 'Kharadi, Pune';
            const price = parseFloat(urlParams.get('price')) || 1500;
            
            // Update HTML elements
            turfNameH2.textContent = decodeURIComponent(name);
            turfLocationSpan.textContent = decodeURIComponent(location);
            basePriceDisplay.textContent = price.toFixed(2);
            
            // Set the dynamic rate variable
            TURF_RATE = price;
        }

        // Helper function to convert 'HH:MM' string to total minutes (for comparison)
        function timeToMinutes(time) {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }

        // Populates the Start Time and End Time dropdowns based on SELECTED slots
        function updateTimeSelectorsFromSlots() {
            const selectedSlots = allSlotButtons.filter(btn => btn.classList.contains('selected'));
            
            // Clear current options
            startTimeSelect.innerHTML = '<option value="">Start Time</option>';
            endTimeSelect.innerHTML = '<option value="">End Time</option>';

            if (selectedSlots.length === 0) {
                // If no slots are selected, populate dropdowns with all available slots for manual selection
                populateTimeSelectors(); 
                startTimeSelect.disabled = false;
                endTimeSelect.disabled = false;
            } else {
                // If slots are selected, set dropdowns to the start and end of the contiguous block
                const firstSelectedTime = selectedSlots[0].getAttribute('data-time');
                const lastSelectedEndTime = selectedSlots[selectedSlots.length - 1].getAttribute('data-end-time');
                
                // Add the selected start time to the Start Time dropdown
                let startOption = document.createElement('option');
                startOption.value = firstSelectedTime;
                startOption.textContent = firstSelectedTime;
                startOption.selected = true;
                startTimeSelect.appendChild(startOption);

                // Add the selected end time to the End Time dropdown
                let endOption = document.createElement('option');
                endOption.value = lastSelectedEndTime;
                endOption.textContent = lastSelectedEndTime;
                endOption.selected = true;
                endTimeSelect.appendChild(endOption);

                // Disable dropdowns to indicate selection is controlled by the grid
                startTimeSelect.disabled = true;
                endTimeSelect.disabled = true;
            }
            
            // Always recalculate the total after updating times
            calculateTotal();
        }

        // Populates dropdowns with all available times 
        function populateTimeSelectors() {
            startTimeSelect.innerHTML = '<option value="">Start Time</option>';
            endTimeSelect.innerHTML = '<option value="">End Time</option>';

            const slotsToConsider = allSlotButtons.filter(btn => btn.classList.contains('available') || btn.classList.contains('selected'));
            if (slotsToConsider.length === 0) return;

            const hourMarkers = new Set();
            
            slotsToConsider.forEach(btn => {
                hourMarkers.add(btn.getAttribute('data-time'));
                hourMarkers.add(btn.getAttribute('data-end-time'));
            });
            
            const sortedTimes = Array.from(hourMarkers).sort();
            
            // Populate Start Time 
            slotsToConsider.forEach(btn => {
                const time = btn.getAttribute('data-time');
                if (!startTimeSelect.querySelector(`option[value="${time}"]`)) { 
                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = time;
                    startTimeSelect.appendChild(option);
                }
            });

            // Populate End Time 
            sortedTimes.forEach(time => {
                if (!endTimeSelect.querySelector(`option[value="${time}"]`)) { 
                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = time;
                    endTimeSelect.appendChild(option);
                }
            });
        }
        
        // Calculate the booking duration and total price, including contiguous check
        function calculateTotal() {
            const startTimeValue = startTimeSelect.value;
            const endTimeValue = endTimeSelect.value;

            // Update fixed rate display
            summaryRate.textContent = `₹${TURF_RATE.toFixed(2)}`;

            if (!startTimeValue || !endTimeValue || TURF_RATE === 0) {
                summaryDuration.textContent = '0 Hours';
                summaryFee.textContent = '₹0.00';
                totalAmount.textContent = '₹0.00';
                return;
            }

            const startMinutes = timeToMinutes(startTimeValue);
            const endMinutes = timeToMinutes(endTimeValue);
            
            let durationMinutes = endMinutes - startMinutes;
            let durationHours = durationMinutes / 60;
            
            if (durationHours <= 0 || durationMinutes % 60 !== 0) {
                summaryDuration.textContent = 'Invalid Duration';
                summaryFee.textContent = '₹0.00';
                totalAmount.textContent = '₹0.00';
                return;
            }

            // CRITICAL VALIDATION: Check if ALL slots between start and end time are 'available'
            let isContiguousAvailable = true;
            for (let i = 0; i < allSlotButtons.length; i++) {
                const slotBtn = allSlotButtons[i];
                const slotStartMinutes = timeToMinutes(slotBtn.getAttribute('data-time'));

                if (slotStartMinutes >= startMinutes && slotStartMinutes < endMinutes) {
                    if (slotBtn.classList.contains('booked')) {
                        isContiguousAvailable = false;
                        break;
                    }
                }
            }
            
            if (!isContiguousAvailable) {
                summaryDuration.textContent = 'Block Blocked';
                summaryFee.textContent = '₹0.00';
                totalAmount.textContent = '₹0.00';
                // Only alert if the grid is NOT disabled, otherwise the grid selection logic handles this
                if (!startTimeSelect.disabled) {
                    alert("The selected time block is not continuously available. Please choose a different duration.");
                }
                return;
            }
            
            // Calculate costs
            const subtotal = durationHours * TURF_RATE;
            const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
            const total = subtotal + serviceFee;

            // Update summary
            summaryDuration.textContent = `${durationHours} Hour${durationHours > 1 ? 's' : ''}`;
            summaryFee.textContent = `₹${serviceFee.toFixed(2)}`;
            totalAmount.textContent = `₹${total.toFixed(2)}`;
        }

        // Handles slot button clicks (for visual selection and updating dropdowns)
        timeSlotsGrid.addEventListener('click', (event) => {
            const clickedSlot = event.target;
            if (clickedSlot.classList.contains('slot-btn') && !clickedSlot.classList.contains('booked')) {
                const isSelected = clickedSlot.classList.contains('selected');
                
                const clickedStart = timeToMinutes(clickedSlot.getAttribute('data-time'));

                if (!isSelected) {
                    // --- Selection Logic ---
                    let selected = allSlotButtons.filter(btn => btn.classList.contains('selected'));
                    
                    if (selected.length === 0) {
                        // First selection
                        clickedSlot.classList.add('selected');
                    } else {
                        // Check if the new selection is adjacent to the current block
                        const firstSelectedStart = timeToMinutes(selected[0].getAttribute('data-time'));
                        const lastSelectedEnd = timeToMinutes(selected[selected.length - 1].getAttribute('data-end-time'));
                        const clickedEnd = timeToMinutes(clickedSlot.getAttribute('data-end-time'));
                        
                        if (clickedStart === lastSelectedEnd) {
                             // Extend the block to the right
                            clickedSlot.classList.add('selected');
                        } else if (clickedEnd === firstSelectedStart) {
                            // Extend the block to the left
                            clickedSlot.classList.add('selected');
                        } else {
                            // Clicked slot is not adjacent, so start a NEW selection block
                            allSlotButtons.forEach(btn => btn.classList.remove('selected'));
                            clickedSlot.classList.add('selected');
                        }
                    }
                } else {
                    // --- Deselection Logic ---
                    
                    // Remove the 'selected' class from the clicked slot
                    clickedSlot.classList.remove('selected');
                    
                    // Re-evaluate the new block of selected slots
                    let selected = allSlotButtons.filter(btn => btn.classList.contains('selected'));
                    
                    if (selected.length > 0) {
                        // Check if the deselection created a split in the block.
                        const newFirstTime = timeToMinutes(selected[0].getAttribute('data-time'));
                        let contiguous = true;
                        
                        // Check forward contiguity from the new start
                        let currentTime = newFirstTime;
                        for (const btn of selected) {
                            if (timeToMinutes(btn.getAttribute('data-time')) !== currentTime) {
                                contiguous = false;
                                break;
                            }
                            currentTime = timeToMinutes(btn.getAttribute('data-end-time'));
                        }
                        
                        if (!contiguous) {
                            // The deselection split the block, so deselect ALL to force a new selection
                            selected.forEach(btn => btn.classList.remove('selected'));
                            alert("Deselecting that slot would create a non-contiguous booking. Please select a new, single time block.");
                        }
                    }
                }

                // Update the dropdowns and calculation based on the new selection
                updateTimeSelectorsFromSlots();
            }
        });
        
        // Event listeners for manual selection (only active if no slots are selected)
        startTimeSelect.addEventListener('change', () => {
             if (!startTimeSelect.disabled) {
                calculateTotal();
             }
        });
        endTimeSelect.addEventListener('change', () => {
             if (!endTimeSelect.disabled) {
                calculateTotal();
             }
        });
        
        function processBooking() {
            if (totalAmount.textContent === '₹0.00' || totalAmount.textContent === 'Invalid Duration' || totalAmount.textContent === 'Block Blocked') {
                alert("Please select a valid, continuously available booking duration before proceeding.");
                return;
            }
            const turf = turfNameH2.textContent;
            const total = totalAmount.textContent;
            alert(`✅ Booking initiated for ${turf}.\n📅 Date: ${document.getElementById('bookingDate').value}\n🕰️ Duration: ${startTimeSelect.value} to ${endTimeSelect.value}\n💸 Total Price: ${total}.\n\n(This is a front-end placeholder action for a real payment gateway.)`);
        }

        // Initialization
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Load data from URL
            loadTurfDetails(); 
            
            // 2. Set minimum date
            const today = new Date().toISOString().split('T')[0];
            document.getElementById("bookingDate").setAttribute('min', today);
            document.getElementById("bookingDate").value = today; 
            
            // 3. Initial setup for slot selectors
            populateTimeSelectors();
            calculateTotal(); 
        });