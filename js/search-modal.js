/**
 * WOLFPix Salon - Instant Live Search Modal
 */

const SEARCH_DATABASE = [
  // Services
  { title: 'Signature Makeup', category: 'Services', desc: 'Flawless customized complexion, contoured dimensions and radiant finish.', anchor: '#services' },
  { title: 'Party Makeup', category: 'Services', desc: 'High-impact glam, dramatic eyes and camera-proof longevity for night events.', anchor: '#services' },
  { title: 'Birthday Makeup', category: 'Services', desc: 'Celebratory radiance tailored to your birthday aesthetic and lighting.', anchor: '#services' },
  { title: 'Bridal Makeup', category: 'Services', desc: 'Haute bridal artistry designed for photographic perfection and heartfelt moments.', anchor: '#services' },
  { title: 'Engagement Makeup', category: 'Services', desc: 'Soft romantic luminescence celebrating your love story.', anchor: '#services' },
  { title: 'Editorial Makeup', category: 'Services', desc: 'High-fashion, avant-garde textures and runway-grade precision.', anchor: '#services' },
  { title: 'Photoshoot Makeup', category: 'Services', desc: '4K studio calibrated skin balance, micro-concealing and zero flashback.', anchor: '#services' },
  { title: 'Age-Defying Makeup', category: 'Services', desc: 'Hydration-infused, light-lifting formulas for mature 40+, 50+, 60+ skin.', anchor: '#timeless' },
  { title: 'Skin Preparation', category: 'Services', desc: 'Lymphatic drainage massage, peptide infusion and barrier prep.', anchor: '#services' },
  { title: 'Makeup Consultation', category: 'Services', desc: '1-on-1 color theory, undertone diagnostics and customized beauty blueprint.', anchor: '#consultation' },
  { title: 'Hair Styling', category: 'Services', desc: 'Red carpet blowouts, romantic bridal updos and sleek modern waves.', anchor: '#services' },
  { title: 'Hair & Makeup Packages', category: 'Services', desc: 'Complete luxury transformation package with dual senior stylists.', anchor: '#services' },

  // Looks
  { title: 'Natural Glow Look', category: 'Signature Looks', desc: 'Effortless dewy glass skin with softly groomed brows and tinted balm.', anchor: '#looks' },
  { title: 'Soft Glam Look', category: 'Signature Looks', desc: 'Velvet neutrals, blurred smoky liner and luminous sculpted cheeks.', anchor: '#looks' },
  { title: 'Modern Classic Look', category: 'Signature Looks', desc: 'Satin base, feline wing and iconic velvet crimson lips.', anchor: '#looks' },
  { title: 'Red Carpet Look', category: 'Signature Looks', desc: 'High-definition multidimensional contour with spotlight eye glow.', anchor: '#looks' },
  { title: 'Birthday Glow Look', category: 'Signature Looks', desc: 'Luminous champagne highlights, rose flushed cheeks and glossy pout.', anchor: '#looks' },
  { title: 'Bridal Elegance Look', category: 'Signature Looks', desc: 'Ethereal soft-focus veil, water-resistant elegance and timeless grace.', anchor: '#looks' },
  { title: 'Editorial Beauty Look', category: 'Signature Looks', desc: 'Sharp graphic lines, vinyl gloss and contemporary runway energy.', anchor: '#looks' },
  { title: 'Timeless Beauty Look', category: 'Signature Looks', desc: 'Hydrating, light-lifting and soft contouring for ageless confidence.', anchor: '#timeless' },

  // Articles
  { title: 'How to Prepare Your Skin Before Makeup', category: 'Beauty Journal', desc: 'The secret to flawless application is lymphatic drainage, barrier hydration, and silicone-free priming.', anchor: '#journal' },
  { title: 'Choosing Makeup for Your Skin Undertone', category: 'Beauty Journal', desc: 'Mastering cool, warm, olive, and neutral pigments without ashy cast or oxidation.', anchor: '#journal' },
  { title: 'Makeup Tips for Mature Skin', category: 'Beauty Journal', desc: 'Strategic cream textures, soft focus diffusers, and avoiding powder settling.', anchor: '#journal' },
  { title: 'How to Make Makeup Last Longer', category: 'Beauty Journal', desc: 'Layering hydrators, targeted setting spray veils, and temperature management.', anchor: '#journal' },
  { title: 'Current Beauty Trends', category: 'Beauty Journal', desc: 'The shift towards high-gloss minimalism, espresso liner, and cloud skin.', anchor: '#journal' },
  { title: 'Choosing the Right Foundation', category: 'Beauty Journal', desc: 'How to decode serum foundations, water-based emulsions, and buildable pigments.', anchor: '#journal' }
];

export function initSearchModal() {
  const modalBackdrop = document.getElementById('searchModal');
  const modalClose = document.getElementById('searchModalClose');
  const searchInput = document.getElementById('searchModalInput');
  const searchResultsList = document.getElementById('searchResultsList');
  const triggers = document.querySelectorAll('.search-trigger-btn');

  if (!modalBackdrop || !searchInput || !searchResultsList) return;

  function openSearch() {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 150);
    renderResults(SEARCH_DATABASE);
  }

  function closeSearch() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
  }

  triggers.forEach(t => t.addEventListener('click', openSearch));
  if (modalClose) modalClose.addEventListener('click', closeSearch);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeSearch();
  });

  // Cmd/Ctrl + K shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modalBackdrop.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeSearch();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderResults(SEARCH_DATABASE);
      return;
    }

    const filtered = SEARCH_DATABASE.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    renderResults(filtered);
  });

  function renderResults(items) {
    if (!items.length) {
      searchResultsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No beauty experiences found. Try searching "Bridal", "Mature skin", or "Glow".
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = items.map(item => `
      <a href="${item.anchor}" class="search-result-item" data-anchor="${item.anchor}">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
            <span style="font-weight: 700; font-size: 0.95rem;">${item.title}</span>
            <span style="font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 999px; background: rgba(79, 124, 255, 0.1); color: var(--electric-blue); font-weight: 600;">${item.category}</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">${item.desc}</p>
        </div>
        <span style="font-size: 0.9rem; color: var(--text-muted);">→</span>
      </a>
    `).join('');

    // Add click listeners to close modal upon clicking result
    searchResultsList.querySelectorAll('.search-result-item').forEach(link => {
      link.addEventListener('click', () => {
        closeSearch();
      });
    });
  }
}
