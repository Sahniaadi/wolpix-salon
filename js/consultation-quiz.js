/**
 * WOLFPix Salon - Interactive Beauty Consultation
 * 8-Step Personalized Skin & Artistry Recommendation Engine
 */

export const QUIZ_QUESTIONS = [
  {
    id: 'skinType',
    title: '1. What is your skin type?',
    subtitle: 'Assessing your baseline hydration and sebum dynamics.',
    options: [
      { label: 'Normal / Balanced', value: 'normal', icon: '✨' },
      { label: 'Dry / Dehydrated', value: 'dry', icon: '💧' },
      { label: 'Oily / Lustrous', value: 'oily', icon: '⚡' },
      { label: 'Combination', value: 'combination', icon: '🌓' },
      { label: 'Sensitive / Delicate', value: 'sensitive', icon: '🌸' }
    ]
  },
  {
    id: 'skinTone',
    title: '2. What is your skin tone & undertone?',
    subtitle: 'Ensuring absolute color harmony with zero oxidation.',
    options: [
      { label: 'Fair (Cool / Neutral)', value: 'fair-cool', icon: '🤍' },
      { label: 'Light (Warm / Peachy)', value: 'light-warm', icon: '🥐' },
      { label: 'Medium (Golden / Olive)', value: 'medium-golden', icon: '🍯' },
      { label: 'Tan (Bronze / Warm Amber)', value: 'tan-bronze', icon: '🍂' },
      { label: 'Deep (Rich Espresso / Neutral)', value: 'deep-espresso', icon: '🤎' },
      { label: 'Rich (Ebony / Cool Blue)', value: 'rich-ebony', icon: '💎' }
    ]
  },
  {
    id: 'finish',
    title: '3. What makeup finish do you prefer?',
    subtitle: 'Selecting your light-reflecting skin finish preference.',
    options: [
      { label: 'Radiant Dewy Glow', value: 'dewy', icon: '✨' },
      { label: 'Soft-Focus Velvet Matte', value: 'velvet-matte', icon: '☁️' },
      { label: 'Natural Second-Skin Satin', value: 'satin', icon: '🌿' },
      { label: 'Glass-Skin Luminous Finish', value: 'glass-skin', icon: '💎' }
    ]
  },
  {
    id: 'occasion',
    title: '4. What is the occasion?',
    subtitle: 'Formulating endurance and lighting calibration for your event.',
    options: [
      { label: 'Milestone Celebration / 50th Birthday', value: 'milestone-birthday', icon: '🥂' },
      { label: 'Haute Bridal / Wedding Ceremony', value: 'bridal', icon: '💍' },
      { label: 'Red Carpet / Black-Tie Gala', value: 'red-carpet', icon: '🎬' },
      { label: 'Editorial / Studio Photoshoot', value: 'photoshoot', icon: '📸' },
      { label: 'Intimate Dinner & Evening Soirée', value: 'evening', icon: '🕯️' }
    ]
  },
  {
    id: 'attire',
    title: '5. What are you wearing?',
    subtitle: 'Harmonizing pigment hues with fabrics and necklines.',
    options: [
      { label: 'Fluid Silk & Satin Charmeuse', value: 'silk', icon: '🪡' },
      { label: 'Structured Tailored Suiting', value: 'tailored', icon: '🧥' },
      { label: 'Haute Couture Evening Gown', value: 'couture', icon: '👗' },
      { label: 'Minimalist Architectural Monochrome', value: 'monochrome', icon: '📐' },
      { label: 'Jeweled or Metallic Statement Dress', value: 'metallic', icon: '🌟' }
    ]
  },
  {
    id: 'coverage',
    title: '6. What coverage do you prefer?',
    subtitle: 'Balancing skin breathability with imperceptible correction.',
    options: [
      { label: 'Sheer & Radiant Tint', value: 'sheer', icon: '🫧' },
      { label: 'Medium Weightless Buildable', value: 'medium', icon: '🪄' },
      { label: 'Full High-Definition Perfection', value: 'full', icon: '🛡️' },
      { label: 'Targeted Micro-Concealing Only', value: 'targeted', icon: '🎯' }
    ]
  },
  {
    id: 'features',
    title: '7. Which features would you like to emphasize?',
    subtitle: 'Directing the focal points of your custom makeup architecture.',
    options: [
      { label: 'Radiant Glass Skin & Lifted Cheekbones', value: 'cheekbones', icon: '✨' },
      { label: 'Softly Defined Eyes & Whispering Lashes', value: 'eyes', icon: '👁️' },
      { label: 'Sculpted Flattering Statement Lips', value: 'lips', icon: '💄' },
      { label: 'Feathery Natural Brows & Soft Symmetry', value: 'brows', icon: '🪶' }
    ]
  },
  {
    id: 'style',
    title: '8. What makeup style do you prefer?',
    subtitle: 'Your signature aesthetic identity.',
    options: [
      { label: 'Natural Glow', value: 'Natural', icon: '🌿' },
      { label: 'Soft Glam', value: 'Soft Glam', icon: '✨' },
      { label: 'Modern Classic', value: 'Classic', icon: '👑' },
      { label: 'Bold Red Carpet', value: 'Bold', icon: '💋' },
      { label: 'Avant-Garde Editorial', value: 'Editorial', icon: '🎨' },
      { label: 'Bridal Elegance', value: 'Bridal', icon: '🕊️' },
      { label: 'Age-Defying Timeless Glow', value: 'Age-Defying', icon: '⏳' }
    ]
  }
];

export function initConsultationQuiz() {
  let currentStep = 0;
  const answers = {};

  const progressBar = document.getElementById('quizProgressBar');
  const stepIndicator = document.getElementById('quizStepIndicator');
  const questionTitle = document.getElementById('quizQuestionTitle');
  const questionSubtitle = document.getElementById('quizQuestionSubtitle');
  const optionsGrid = document.getElementById('quizOptionsGrid');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  const questionsBox = document.getElementById('quizQuestionsBox');
  const resultBox = document.getElementById('quizResultBox');

  if (!questionsBox || !optionsGrid) return;

  function renderStep(index) {
    const q = QUIZ_QUESTIONS[index];
    const total = QUIZ_QUESTIONS.length;

    progressBar.style.width = `${((index + 1) / total) * 100}%`;
    stepIndicator.textContent = `Question ${index + 1} of ${total}`;
    questionTitle.textContent = q.title;
    questionSubtitle.textContent = q.subtitle;

    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = index === total - 1 ? 'Generate Formula ✨' : 'Next Step →';

    optionsGrid.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `quiz-option-btn ${answers[q.id] === opt.value ? 'selected' : ''}`;
      btn.innerHTML = `
        <span class="quiz-option-icon">${opt.icon}</span>
        <span>${opt.label}</span>
      `;
      btn.addEventListener('click', () => {
        answers[q.id] = opt.value;
        renderStep(index);
      });
      optionsGrid.appendChild(btn);
    });

    nextBtn.disabled = !answers[q.id];
    nextBtn.style.opacity = answers[q.id] ? '1' : '0.5';
  }

  function generateResults() {
    questionsBox.style.display = 'none';
    resultBox.classList.add('active');

    const styleName = answers['style'] || 'Timeless Beauty';
    const skinType = answers['skinType'] || 'Balanced';
    const finish = answers['finish'] || 'Radiant';
    const coverage = answers['coverage'] || 'Medium';

    document.getElementById('resultArchetypeTitle').textContent = `The ${styleName} Blueprint`;
    document.getElementById('resultSkinPrepFormula').textContent = 
      skinType === 'dry' ? 'Ceramide Moisture Infusion + Hyaluronic Dew Seal' :
      skinType === 'oily' ? 'Niacinamide Pore Primer + Velvet Micro-Setting' :
      skinType === 'sensitive' ? 'Centella Calming Veil + Mineral Hypoallergenic Base' :
      'Skin-Mimetic Peptide Primer + Rose Water Luminescence';

    document.getElementById('resultComplexionFormula').textContent = 
      `${coverage.toUpperCase()} coverage with breathable light-refracting microspheres for a ${finish} finish.`;

    document.getElementById('resultFocusFormula').textContent = 
      `Accentuated ${answers['features'] || 'Radiant Skin'} calibrated for ${answers['occasion'] || 'Milestone Occasion'}.`;

    // Persist consultation lead to backend
    fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        styleName,
        skinType,
        finish,
        coverage,
        undertone: answers['skinTone'] || 'Medium',
        occasion: answers['occasion'] || 'Special Event',
        attire: answers['attire'] || 'Formal',
        features: answers['features'] || 'Radiant Skin'
      })
    }).catch(err => console.warn('Could not save consultation diagnostic to backend:', err));

    // Connect Book CTA to Booking Form
    const bookBtn = document.getElementById('resultBookBtn');
    if (bookBtn) {
      bookBtn.onclick = () => {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
          const serviceSelect = document.getElementById('bookingService');
          if (serviceSelect) {
            serviceSelect.value = styleName === 'Age-Defying' ? 'Age-Defying Makeup' :
                                  styleName === 'Bridal' ? 'Bridal Makeup' :
                                  styleName === 'Editorial' ? 'Editorial Makeup' :
                                  'Signature Makeup';
          }
          const requestInput = document.getElementById('bookingRequests');
          if (requestInput) {
            requestInput.value = `Consultation Result: Style=${styleName}, Skin=${skinType}, Finish=${finish}, Coverage=${coverage}`;
          }
        }
      };
    }
  }

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep(currentStep);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      currentStep++;
      renderStep(currentStep);
    } else {
      generateResults();
    }
  });

  // Reset Quiz
  const restartBtn = document.getElementById('quizRestartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentStep = 0;
      Object.keys(answers).forEach(k => delete answers[k]);
      resultBox.classList.remove('active');
      questionsBox.style.display = 'block';
      renderStep(0);
    });
  }

  renderStep(0);
}
