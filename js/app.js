/**
 * WOLFPix Salon - Application Master Controller
 * "Where Beauty Meets Precision."
 */

import { initBeforeAfterSlider } from './before-after-slider.js';
import { initConsultationQuiz } from './consultation-quiz.js';
import { initBookingSystem } from './booking-system.js';
import { initSearchModal } from './search-modal.js';
import { initJournalReader } from './journal-reader.js';

// 11-Step Age-Defying Beauty Workflow Database
const TIMELESS_STEPS = [
  {
    step: 1,
    title: 'Analyze Skin Type & Texture',
    desc: 'Perform a tactile and visual skin barrier assessment. We map hydration levels, identify micro-dryness around expression areas, and examine pore dynamics under 5500K daylight simulation to prevent texture exaggeration.',
    proTip: 'For our 50th birthday client, we identified dehydration at the outer perimeters and subtle forehead expression lines that require water-binding emollients rather than powder.'
  },
  {
    step: 2,
    title: 'Prepare & Hydrate the Skin',
    desc: 'Infuse high-concentration multi-molecular hyaluronic acid serum followed by a squalane peptide emulsion. A 5-minute lymphatic drainage sweep lifts the jawline and eases muscle tension.',
    proTip: 'Allow skincare to absorb for precisely 3 minutes before beginning base application to avoid pilling.'
  },
  {
    step: 3,
    title: 'Select Lightweight Complexion Products',
    desc: 'Dispense heavy full-coverage foundation. We apply a sheer, light-refracting fluid serum foundation enriched with niacinamide, buffing with a dense duo-fiber brush to mimic natural skin luminosity.',
    proTip: 'The skin should always look like fresh, rested skin—not makeup sitting on top.'
  },
  {
    step: 4,
    title: 'Use Targeted Micro-Concealing',
    desc: 'Place micro-dots of self-setting serum concealer only at the inner corner tear duct discoloration and upward angled outer corner. We leave the outer crow’s feet area completely unpowdered to preserve natural eye warmth.',
    proTip: 'Baking is strictly prohibited on mature skin; it settles into fine lines and accentuates crepiness.'
  },
  {
    step: 5,
    title: 'Create Soft Facial Dimension',
    desc: 'Sculpt cheekbones and jawlines using warm taupe liquid bronzing drops blended upward towards the temples. Avoid sharp lines; our goal is lifting shadows that mimic youthful bone structure.',
    proTip: 'Keep contour placement slightly higher than natural hollows to create an optical lifting effect.'
  },
  {
    step: 6,
    title: 'Apply Cream Blush & Bronzer',
    desc: 'Tap a dewy rose-champagne cream blush onto the higher apex of the cheekbones, feathering outward. Cream formulas melt seamlessly with skin oils and reflect ambient room light with fresh vitality.',
    proTip: 'Warm the cream blush on the back of your hand before patting onto the client.'
  },
  {
    step: 7,
    title: 'Create Softly Defined Eyes',
    desc: 'Define the lash base with smudged cocoa-espresso gel pencil rather than harsh black liquid eyeliner. Wash the lids with a satin champagne neutral shadow that brightens without emphasizing lid texture.',
    proTip: 'Matte dark powders can make mature hooded lids appear recessed; satin neutrals reflect light forward.'
  },
  {
    step: 8,
    title: 'Shape Natural-Looking Brows',
    desc: 'Fill sparse arch areas using hair-like micro-strokes with a fine taupe pencil, then brush upward using a conditioning clear peptide gel to frame the eyes with youthful fullness.',
    proTip: 'Never draw blocky edges. Feathery brows instantly take years off the overall facial silhouette.'
  },
  {
    step: 9,
    title: 'Add a Flattering Lip Color',
    desc: 'Line and softly contour lips slightly outside the natural vermilion border using a nude-rose waterproof pencil, followed by a hydrating peptide-infused satin lipstick in dusty rose or warm peach.',
    proTip: 'Top with a dab of nourishing glass gloss strictly on the center of the bottom lip for instant volume.'
  },
  {
    step: 10,
    title: 'Set Makeup Strategically',
    desc: 'Press micro-milled transparent silica powder solely on the center of the chin, sides of the nose, and center of the forehead using a miniature velvet puff. The cheeks, temples, and perimeter remain completely dewy.',
    proTip: 'Selective setting keeps makeup locked for 14+ hours while maintaining high-fashion dewy skin.'
  },
  {
    step: 11,
    title: 'Finish with a Natural Radiant Glow',
    desc: 'Mist the entire face with a dual-phase antioxidant floral setting elixir that fuses all cream layers together into a luminous, breathable, age-defying second skin that glows under celebratory evening lights.',
    proTip: 'Our 50th birthday client radiated pure timeless elegance, confidence, and modern youthfulness.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Scroll Effect
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileClose = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 3. Timeless Beauty 11-Step Workflow Interactive Controller
  const stepButtonsContainer = document.getElementById('workflowStepsList');
  const stepIndexBadge = document.getElementById('workflowStepIndexBadge');
  const stepTitle = document.getElementById('workflowDetailTitle');
  const stepBody = document.getElementById('workflowDetailBody');
  const proTipBody = document.getElementById('workflowProTipBody');
  const prevStepBtn = document.getElementById('workflowPrevStep');
  const nextStepBtn = document.getElementById('workflowNextStep');

  let activeStepIndex = 0;

  function renderWorkflowStep(index) {
    activeStepIndex = index;
    const data = TIMELESS_STEPS[index];
    if (!data) return;

    stepIndexBadge.textContent = `Step ${data.step} of 11 • Professional Artistry Protocol`;
    stepTitle.textContent = data.title;
    stepBody.textContent = data.desc;
    proTipBody.textContent = data.proTip;

    if (stepButtonsContainer) {
      const btns = stepButtonsContainer.querySelectorAll('.workflow-step-btn');
      btns.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
    }

    if (prevStepBtn) prevStepBtn.disabled = index === 0;
    if (nextStepBtn) nextStepBtn.disabled = index === TIMELESS_STEPS.length - 1;
  }

  // Populate Workflow Step Buttons
  if (stepButtonsContainer) {
    stepButtonsContainer.innerHTML = TIMELESS_STEPS.map((s, i) => `
      <button type="button" class="workflow-step-btn ${i === 0 ? 'active' : ''}" data-step-index="${i}">
        <span class="workflow-step-num">${s.step}</span>
        <span>${s.title}</span>
      </button>
    `).join('');

    stepButtonsContainer.querySelectorAll('.workflow-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.stepIndex, 10);
        renderWorkflowStep(idx);
      });
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (activeStepIndex > 0) renderWorkflowStep(activeStepIndex - 1);
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (activeStepIndex < TIMELESS_STEPS.length - 1) renderWorkflowStep(activeStepIndex + 1);
    });
  }

  // 4. Services Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      serviceCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
          card.classList.remove('animate-fade-in');
        }
      });
    });
  });

  // 5. VIP Gazette Newsletter Submission
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) return;

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        alert(data.message || 'Thank you for subscribing to WOLFPix Haute Gazette.');
        newsletterForm.reset();
      } catch (err) {
        alert('Thank you for subscribing to WOLFPix Haute Gazette.');
        newsletterForm.reset();
      }
    });
  }

  // 6. Initialize Sub-modules
  initBeforeAfterSlider();
  initConsultationQuiz();
  initBookingSystem();
  initSearchModal();
  initJournalReader();

  console.log('✨ WOLFPix Salon Luxury Studio Loaded Successfully.');
});
