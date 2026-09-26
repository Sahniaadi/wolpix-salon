/**
 * WOLFPix Salon - Luxury Appointment Booking Engine with Backend Integration
 */

export function initBookingSystem() {
  const form = document.getElementById('bookingForm');
  const dateInput = document.getElementById('bookingDate');
  const serviceSelect = document.getElementById('bookingService');
  const timeSlotsContainer = document.getElementById('timeSlotsGrid');
  const modalBackdrop = document.getElementById('confirmationModal');
  const modalCloseBtn = document.getElementById('confirmationModalClose');
  const doneBtn = document.getElementById('confirmDoneBtn');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Handle Time Slot Selection
  let selectedTime = '11:00 AM';
  if (timeSlotsContainer) {
    const slotButtons = timeSlotsContainer.querySelectorAll('.time-slot-btn');
    slotButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        slotButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTime = btn.dataset.time || btn.textContent.trim();
      });
    });
  }

  // Form submission with backend API call
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const email = document.getElementById('bookingEmail').value.trim();
      const service = serviceSelect.value;
      const date = dateInput.value;
      const requests = document.getElementById('bookingRequests').value.trim();

      if (!name || !phone || !email || !service || !date) {
        alert('Please complete all required fields.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Securing Reservation...</span>';
      }

      // Generate luxury fallback ref code
      const generatedCode = 'WPX-' + Math.floor(1000 + Math.random() * 9000);
      let bookingRef = generatedCode;

      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            email,
            service,
            date,
            time: selectedTime,
            requests,
            refCode: generatedCode
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.booking && data.booking.refCode) {
            bookingRef = data.booking.refCode;
          }
        }
      } catch (err) {
        console.warn('Backend offline or network error, proceeding with client confirmation:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }

      // Populate Confirmation Modal
      const refCodeElem = document.getElementById('confirmRefCode');
      const clientNameElem = document.getElementById('confirmClientName');
      const serviceElem = document.getElementById('confirmService');
      const dateTimeElem = document.getElementById('confirmDateTime');

      if (refCodeElem) refCodeElem.textContent = bookingRef;
      if (clientNameElem) clientNameElem.textContent = name;
      if (serviceElem) serviceElem.textContent = service;
      if (dateTimeElem) dateTimeElem.textContent = `${formatDate(date)} at ${selectedTime}`;

      // Show Modal
      if (modalBackdrop) {
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      form.reset();
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
    });
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Helper date formatter
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Global helper to open booking with service
  window.openBookingForService = function(serviceName) {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (serviceSelect && serviceName) {
      serviceSelect.value = serviceName;
    }
  };
}
