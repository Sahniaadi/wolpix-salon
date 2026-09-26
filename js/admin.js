/**
 * WOLFPix Salon - Studio Management & Operations Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  let allBookings = [];
  let allSubscribers = [];
  let allConsultations = [];

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.style.display = 'none');

      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });

  // Load All Data
  loadStats();
  loadBookings();
  loadSubscribers();
  loadConsultations();

  // Refresh Buttons
  const refreshBookingsBtn = document.getElementById('refreshBookingsBtn');
  if (refreshBookingsBtn) {
    refreshBookingsBtn.addEventListener('click', () => {
      loadStats();
      loadBookings();
    });
  }

  const refreshConsultationsBtn = document.getElementById('refreshConsultationsBtn');
  if (refreshConsultationsBtn) {
    refreshConsultationsBtn.addEventListener('click', loadConsultations);
  }

  // Search & Status Filters
  const searchInput = document.getElementById('bookingSearchInput');
  const statusFilter = document.getElementById('statusFilterSelect');

  if (searchInput) searchInput.addEventListener('input', renderFilteredBookings);
  if (statusFilter) statusFilter.addEventListener('change', renderFilteredBookings);

  // Set default manual date
  const manualDate = document.getElementById('manualDate');
  if (manualDate) {
    manualDate.value = new Date().toISOString().split('T')[0];
    manualDate.min = new Date().toISOString().split('T')[0];
  }

  // Handle Manual Booking
  const manualForm = document.getElementById('adminManualBookForm');
  if (manualForm) {
    manualForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newBooking = {
        name: document.getElementById('manualName').value.trim(),
        phone: document.getElementById('manualPhone').value.trim(),
        email: document.getElementById('manualEmail').value.trim(),
        service: document.getElementById('manualService').value,
        date: document.getElementById('manualDate').value,
        time: document.getElementById('manualTime').value,
        requests: document.getElementById('manualRequests').value.trim()
      };

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBooking)
        });

        const data = await res.json();
        if (res.ok) {
          alert(`Reservation confirmed successfully for ${data.booking.name} (Code: ${data.booking.refCode})`);
          manualForm.reset();
          if (manualDate) manualDate.value = new Date().toISOString().split('T')[0];
          // Switch to bookings tab
          document.querySelector('[data-tab="bookingsTab"]').click();
          loadStats();
          loadBookings();
        } else {
          alert('Error: ' + (data.error || 'Failed to create booking'));
        }
      } catch (err) {
        alert('Network error connecting to server.');
      }
    });
  }

  // Export Subscribers to CSV
  const exportBtn = document.getElementById('exportSubscribersBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!allSubscribers.length) {
        alert('No subscribers to export.');
        return;
      }
      let csv = 'ID,Email,Subscribed Date\n';
      allSubscribers.forEach(s => {
        csv += `"${s.id}","${s.email}","${s.subscribedAt}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wolfpix_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    });
  }

  // API Call: Stats
  async function loadStats() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const stats = await res.json();
        document.getElementById('statTotalBookings').textContent = stats.totalBookings;
        document.getElementById('statConfirmed').textContent = stats.confirmed;
        document.getElementById('statPending').textContent = stats.pending;
        document.getElementById('statSubscribers').textContent = stats.totalSubscribers;
        document.getElementById('statConsultations').textContent = stats.totalConsultations;
      }
    } catch (err) {
      console.warn('Could not load stats:', err);
    }
  }

  // API Call: Bookings
  async function loadBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        allBookings = data.bookings || [];
        renderFilteredBookings();
      } else {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Failed to load reservations.</td></tr>`;
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Error connecting to backend API.</td></tr>`;
    }
  }

  function renderFilteredBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    const query = (searchInput.value || '').toLowerCase();
    const statusVal = statusFilter.value;

    const filtered = allBookings.filter(b => {
      const matchQuery = !query ||
        (b.name && b.name.toLowerCase().includes(query)) ||
        (b.refCode && b.refCode.toLowerCase().includes(query)) ||
        (b.phone && b.phone.toLowerCase().includes(query)) ||
        (b.email && b.email.toLowerCase().includes(query)) ||
        (b.service && b.service.toLowerCase().includes(query));

      const matchStatus = statusVal === 'all' || b.status === statusVal;

      return matchQuery && matchStatus;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No matching salon reservations found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(b => `
      <tr>
        <td><span class="ref-code">${escapeHtml(b.refCode || 'WPX-0000')}</span></td>
        <td>
          <strong style="color: #fff; display: block;">${escapeHtml(b.name)}</strong>
          <span style="color: var(--text-dim); font-size: 0.8rem;">${escapeHtml(b.phone)} • ${escapeHtml(b.email)}</span>
        </td>
        <td><span style="color: var(--cyan); font-weight: 500;">${escapeHtml(b.service)}</span></td>
        <td>
          <div style="color: #fff;">${escapeHtml(b.date)}</div>
          <div style="color: var(--champagne-gold); font-size: 0.8rem;">${escapeHtml(b.time || '11:00 AM')}</div>
        </td>
        <td style="max-width: 250px; color: var(--text-secondary); font-size: 0.82rem;">
          ${escapeHtml(b.requests || 'Standard luxury service preparation')}
        </td>
        <td>
          <select class="status-select" data-id="${b.id}" onchange="window.updateBookingStatus('${b.id}', this.value)">
            <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button class="action-btn" onclick="window.deleteBooking('${b.id}')" title="Delete reservation">✕ Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // Global functions for inline table callbacks
  window.updateBookingStatus = async function(id, newStatus) {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const item = allBookings.find(b => b.id === id);
        if (item) item.status = newStatus;
        loadStats();
      } else {
        alert('Failed to update reservation status.');
      }
    } catch (err) {
      alert('Error updating reservation.');
    }
  };

  window.deleteBooking = async function(id) {
    if (!confirm('Are you sure you want to permanently delete this reservation?')) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        allBookings = allBookings.filter(b => b.id !== id);
        renderFilteredBookings();
        loadStats();
      } else {
        alert('Failed to delete reservation.');
      }
    } catch (err) {
      alert('Error connecting to backend.');
    }
  };

  // API Call: Subscribers
  async function loadSubscribers() {
    const tbody = document.getElementById('subscribersTableBody');
    try {
      const res = await fetch('/api/newsletter');
      if (res.ok) {
        const data = await res.json();
        allSubscribers = data.subscribers || [];
        if (!allSubscribers.length) {
          tbody.innerHTML = `<tr><td colspan="3" class="empty-state">No subscribers found yet.</td></tr>`;
          return;
        }
        tbody.innerHTML = allSubscribers.map(s => `
          <tr>
            <td style="color: var(--text-dim); font-family: monospace;">${escapeHtml(s.id)}</td>
            <td><strong style="color: var(--cyan);">${escapeHtml(s.email)}</strong></td>
            <td style="color: var(--text-secondary);">${new Date(s.subscribedAt).toLocaleString()}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="3" class="empty-state">Could not load subscribers.</td></tr>`;
    }
  }

  // API Call: Consultations
  async function loadConsultations() {
    const tbody = document.getElementById('consultationsTableBody');
    try {
      const res = await fetch('/api/consultations');
      if (res.ok) {
        const data = await res.json();
        allConsultations = data.consultations || [];
        if (!allConsultations.length) {
          tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No consultation diagnostic leads recorded yet.</td></tr>`;
          return;
        }
        tbody.innerHTML = allConsultations.map(c => `
          <tr>
            <td><strong style="color: var(--rose-champagne);">${escapeHtml(c.styleName || c.recommendedLook || 'Custom Look')}</strong></td>
            <td><span style="color: #fff;">${escapeHtml(c.skinType || 'Balanced')}</span></td>
            <td><span style="color: var(--cyan);">${escapeHtml(c.finish || 'Radiant')}</span></td>
            <td><span style="color: var(--text-light);">${escapeHtml(c.coverage || 'Medium')}</span></td>
            <td><span style="color: var(--champagne-gold);">${escapeHtml(c.occasion || 'Event')}</span></td>
            <td style="color: var(--text-dim); font-size: 0.8rem;">${new Date(c.createdAt).toLocaleDateString()}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Could not load consultations.</td></tr>`;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
