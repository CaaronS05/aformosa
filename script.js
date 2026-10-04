'use strict';
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#navigation');
function closeNav() { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Buka navigasi'); }
navToggle.addEventListener('click', () => { const open = navToggle.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); navToggle.setAttribute('aria-expanded', String(open)); navToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeNav(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeNav(); });
// ==========================================
// DATA MENU MINGGUAN (Bisa diganti per batch)
// ==========================================
const menuData = {
  batch: 367,
  start: '2026-10-05',
  end: '2026-10-10',
  days: [
    {
      day: 'Senin',
      shortDay: 'Sen',
      date: '2026-10-05',
      image: 'assets/hero-studio.jpg',
      lunch: { name: 'Ayam Saus Kacang', description: 'Nasi merah, tumis sayur & puding', kcal: 565 },
      dinner: { name: 'Baked Cheese Omelette', description: 'Jagung, sayuran & buah', kcal: 558 }
    },
    {
      day: 'Selasa',
      shortDay: 'Sel',
      date: '2026-10-06',
      image: 'assets/menu-studio-2.jpg',
      lunch: { name: 'Spaghetti Chicken Mushroom', description: 'Pasta, ayam jamur & bayam', kcal: 582 },
      dinner: { name: 'Chicken Meatball', description: 'Mashed potato, sayur & buah', kcal: 560 }
    },
    {
      day: 'Rabu',
      shortDay: 'Rab',
      date: '2026-10-07',
      image: 'assets/menu-studio-3.jpg',
      lunch: { name: 'Ayam Sambal Matah', description: 'Nasi merah, buncis & puding', kcal: 575 },
      dinner: { name: 'Siomay Bandung', description: 'Bihun, kentang, sayur & buah', kcal: 552 }
    },
    {
      day: 'Kamis',
      shortDay: 'Kam',
      date: '2026-10-08',
      image: 'assets/menu-studio-4.jpg',
      lunch: { name: 'Classic Fish & Chips', description: 'Potato wedges, sayur & puding', kcal: 580 },
      dinner: { name: 'Tuna & Egg Salad', description: 'Garlic bread, salad & buah', kcal: 568 }
    },
    {
      day: 'Jumat',
      shortDay: 'Jum',
      date: '2026-10-09',
      image: 'assets/menu-studio-5.jpg',
      lunch: { name: 'Healthy Ketoprak', description: 'Tahu, telur, bihun & sayuran', kcal: 555 },
      dinner: { name: 'Golden Chicken', description: 'Nasi merah, bayam & puding', kcal: 588 }
    },
    {
      day: 'Sabtu',
      shortDay: 'Sab',
      date: '2026-10-10',
      image: 'assets/menu-studio-6.jpg',
      lunch: { name: 'Chicken Katsu Salad', description: 'Ubi, telur, edamame & buah', kcal: 570 },
      dinner: { name: 'Chicken & Scrambled Egg', description: 'Nasi merah, wortel & sayuran', kcal: 590 }
    }
  ]
};

const smallIcons = {
  lunch: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  dinner: '<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z"/>'
};

// ==========================================
// RENDER & CONTROLLER CAROUSEL MENU MINGGUAN
// ==========================================
const weeklyMenu = document.querySelector('#weekly-menu');
const menuTabsContainer = document.querySelector('#menu-day-tabs');
const menuDotsContainer = document.querySelector('#menu-dots');
const menuPrevBtn = document.querySelector('#menu-prev');
const menuNextBtn = document.querySelector('#menu-next');

if (weeklyMenu) {
  // 1. Render Day Tabs, Cards, and Dots
  menuData.days.forEach((day, index) => {
    // Tab Button
    if (menuTabsContainer) {
      const tabBtn = document.createElement('button');
      tabBtn.type = 'button';
      tabBtn.className = `menu-tab-btn ${index === 0 ? 'active' : ''}`;
      tabBtn.setAttribute('role', 'tab');
      tabBtn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tabBtn.setAttribute('aria-label', `Pilih menu ${day.day}`);
      tabBtn.textContent = day.shortDay || day.day.slice(0, 3);
      tabBtn.dataset.index = index;
      tabBtn.addEventListener('click', () => scrollToCard(index));
      menuTabsContainer.append(tabBtn);
    }

    // Carousel Card
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.dataset.index = index;
    card.dataset.day = day.day;

    const formattedDate = new Date(day.date + 'T12:00:00').toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });

    const placeholderMarkup = `
      <div class="menu-photo__placeholder-inner">
        <svg aria-hidden="true" class="menu-photo__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M12 2a9 9 0 0 0-9 9c0 3.8 2.4 7 5.8 8.3L12 22l3.2-2.7C18.6 18 21 14.8 21 11a9 9 0 0 0-9-9z"/>
          <path d="M7 10h10"/>
        </svg>
        <p class="menu-photo__text">Dimasak Segar Setiap Hari</p>
        <span class="menu-photo__subtext">Menu bergizi seimbang</span>
      </div>
    `;

    const photoContainer = document.createElement('div');
    if (day.image) {
      photoContainer.className = 'menu-photo';
      const img = document.createElement('img');
      img.src = day.image;
      img.alt = `Penyajian menu Aformosa untuk ${day.day}`;
      img.width = 1024;
      img.height = 1536;
      img.loading = 'lazy';
      img.draggable = false;
      img.addEventListener('error', () => {
        photoContainer.className = 'menu-photo menu-photo--placeholder';
        photoContainer.innerHTML = placeholderMarkup;
      });
      photoContainer.appendChild(img);
    } else {
      photoContainer.className = 'menu-photo menu-photo--placeholder';
      photoContainer.innerHTML = placeholderMarkup;
    }

    card.innerHTML = `
      <div class="menu-card-heading">
        <span class="day-pill">${day.day}</span>
        <time datetime="${day.date}">${formattedDate}</time>
      </div>
    `;
    card.appendChild(photoContainer);

    const mealDetails = document.createElement('div');
    mealDetails.className = 'meal-details';
    mealDetails.innerHTML = ['lunch', 'dinner'].map(type => `
      <div data-meal="${type}">
        <span class="meal-type">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            ${smallIcons[type]}
          </svg>
          ${type === 'lunch' ? 'Makan siang' : 'Makan malam'}
        </span>
        <h3>${day[type].name}</h3>
        <p>${day[type].description}</p>
        <span class="kcal">${day[type].kcal} kkal</span>
      </div>
    `).join('');
    card.appendChild(mealDetails);

    weeklyMenu.append(card);

    // Progress Dot
    if (menuDotsContainer) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `menu-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Lihat menu ${day.day}`);
      dot.dataset.index = index;
      dot.addEventListener('click', () => scrollToCard(index));
      menuDotsContainer.append(dot);
    }
  });

  const cards = weeklyMenu.querySelectorAll('.menu-card');
  const tabs = menuTabsContainer ? menuTabsContainer.querySelectorAll('.menu-tab-btn') : [];
  const dots = menuDotsContainer ? menuDotsContainer.querySelectorAll('.menu-dot') : [];

  // Function to smoothly scroll to a specific card
  function scrollToCard(index) {
    if (!cards[index]) return;
    const targetCard = cards[index];
    const isMobile = window.innerWidth <= 768;
    const centerOffset = isMobile ? (weeklyMenu.clientWidth - targetCard.offsetWidth) / 2 : 0;
    const offset = targetCard.offsetLeft - weeklyMenu.offsetLeft - centerOffset;
    weeklyMenu.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    updateActiveState(index);
  }

  // Update tabs, dots, and navigation button disabled states
  function updateActiveState(activeIndex) {
    tabs.forEach((tab, i) => {
      const isActive = i === activeIndex;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });

    if (menuPrevBtn) {
      menuPrevBtn.disabled = weeklyMenu.scrollLeft <= 10;
    }
    if (menuNextBtn) {
      const maxScroll = weeklyMenu.scrollWidth - weeklyMenu.clientWidth - 10;
      menuNextBtn.disabled = weeklyMenu.scrollLeft >= maxScroll;
    }
  }

  // Prev / Next button click handlers
  if (menuPrevBtn) {
    menuPrevBtn.addEventListener('click', () => {
      const currentScroll = weeklyMenu.scrollLeft;
      const isMobile = window.innerWidth <= 768;
      let targetIndex = 0;
      for (let i = cards.length - 1; i >= 0; i--) {
        const centerOffset = isMobile ? (weeklyMenu.clientWidth - cards[i].offsetWidth) / 2 : 0;
        const cardOffset = cards[i].offsetLeft - weeklyMenu.offsetLeft - centerOffset;
        if (cardOffset < currentScroll - 15) {
          targetIndex = i;
          break;
        }
      }
      scrollToCard(targetIndex);
    });
  }

  if (menuNextBtn) {
    menuNextBtn.addEventListener('click', () => {
      const currentScroll = weeklyMenu.scrollLeft;
      const isMobile = window.innerWidth <= 768;
      let targetIndex = cards.length - 1;
      for (let i = 0; i < cards.length; i++) {
        const centerOffset = isMobile ? (weeklyMenu.clientWidth - cards[i].offsetWidth) / 2 : 0;
        const cardOffset = cards[i].offsetLeft - weeklyMenu.offsetLeft - centerOffset;
        if (cardOffset > currentScroll + 15) {
          targetIndex = i;
          break;
        }
      }
      scrollToCard(targetIndex);
    });
  }

  // Track active card on scroll with requestAnimationFrame
  let scrollTicking = false;
  weeklyMenu.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        let bestIndex = 0;
        let minDistance = Infinity;
        const currentScroll = weeklyMenu.scrollLeft;
        const isMobile = window.innerWidth <= 768;
        cards.forEach((card, i) => {
          const centerOffset = isMobile ? (weeklyMenu.clientWidth - card.offsetWidth) / 2 : 0;
          const cardOffset = card.offsetLeft - weeklyMenu.offsetLeft - centerOffset;
          const dist = Math.abs(cardOffset - currentScroll);
          if (dist < minDistance) {
            minDistance = dist;
            bestIndex = i;
          }
        });
        updateActiveState(bestIndex);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Initial update
  updateActiveState(0);

  // Mouse Drag-to-scroll for Desktop
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;

  weeklyMenu.addEventListener('mousedown', (e) => {
    isDragging = true;
    weeklyMenu.classList.add('is-dragging');
    dragStartX = e.pageX - weeklyMenu.offsetLeft;
    dragStartScrollLeft = weeklyMenu.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      weeklyMenu.classList.remove('is-dragging');
    }
  });

  weeklyMenu.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - weeklyMenu.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    weeklyMenu.scrollLeft = dragStartScrollLeft - walk;
  });
}
// Isi src, nama, dan caption setelah video pelanggan tersedia.
const testimonialVideos = [
  {
    src: 'assets/videos/testimonial-1.mp4',
    name: '',
    caption: ''
  },
  {
    src: 'assets/videos/testimonial-2.mp4',
    name: '',
    caption: ''
  },
  {
    src: 'assets/videos/testimonial-3.mp4',
    name: '',
    caption: ''
  },
  {
    src: 'assets/videos/testimonial-5.mp4',
    name: '',
    caption: ''
  }
];
testimonialVideos.forEach((item, index) => {
  if (!item || !item.src) return;
  const slot = document.querySelector(`[data-video-index="${index}"]`);
  if (!slot) return;

  const originalChildren = Array.from(slot.childNodes).map(node => node.cloneNode(true));
  const video = document.createElement('video');
  video.src = item.src;
  video.autoplay = true;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;
  video.preload = 'metadata';
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('preload', 'metadata');
  video.setAttribute('aria-label', item.caption || 'Video pengalaman pelanggan Aformosa');

  video.addEventListener('error', () => {
    slot.classList.remove('has-video');
    slot.replaceChildren(...originalChildren);
  }, { once: true });

  const startAutoplay = () => {
    video.play().catch(() => {});
  };
  video.addEventListener('canplay', startAutoplay, { once: true });
  video.addEventListener('loadedmetadata', startAutoplay, { once: true });
  startAutoplay();

  slot.replaceChildren(video);
  slot.classList.add('has-video');

  const soundBtn = document.createElement('button');
  soundBtn.type = 'button';
  soundBtn.className = 'video-sound-toggle';
  soundBtn.setAttribute('aria-label', 'Nyalakan suara');
  soundBtn.setAttribute('title', 'Nyalakan suara');

  const volumeMutedSvg = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>';
  const volumeHighSvg = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';

  soundBtn.innerHTML = volumeMutedSvg;

  const updateSoundIcon = () => {
    if (video.muted) {
      soundBtn.innerHTML = volumeMutedSvg;
      soundBtn.setAttribute('aria-label', 'Nyalakan suara');
      soundBtn.setAttribute('title', 'Nyalakan suara');
      soundBtn.classList.remove('is-unmuted');
    } else {
      soundBtn.innerHTML = volumeHighSvg;
      soundBtn.setAttribute('aria-label', 'Matikan suara');
      soundBtn.setAttribute('title', 'Matikan suara');
      soundBtn.classList.add('is-unmuted');
    }
  };

  soundBtn.addEventListener('pointerdown', e => e.stopPropagation());
  soundBtn.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
  soundBtn.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();
    if (video.muted) {
      document.querySelectorAll('.video-slot video').forEach(otherVideo => {
        if (otherVideo !== video) {
          otherVideo.muted = true;
          const otherBtn = otherVideo.parentElement?.querySelector('.video-sound-toggle');
          if (otherBtn) {
            otherBtn.innerHTML = volumeMutedSvg;
            otherBtn.setAttribute('aria-label', 'Nyalakan suara');
            otherBtn.setAttribute('title', 'Nyalakan suara');
            otherBtn.classList.remove('is-unmuted');
          }
        }
      });
      video.muted = false;
      video.play().catch(() => {});
    } else {
      video.muted = true;
    }
    updateSoundIcon();
  });

  slot.append(soundBtn);

  if (item.name || item.caption) {
    const caption = document.createElement('div');
    caption.className = 'video-placeholder';
    if (item.name) {
      const name = document.createElement('strong');
      name.textContent = item.name;
      caption.append(name);
    }
    if (item.caption) {
      const text = document.createElement('small');
      text.textContent = item.caption;
      caption.append(text);
    }
    slot.append(caption);
  }
});
const track = document.querySelector('#testimonial-track');
if (track) {
  const testimonialMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const originalColumns = [...track.querySelectorAll('.testimonial-column')];
  let testimonialLoopWidth = 0;
  let testimonialPosition = track.scrollLeft;
  let testimonialFrame = 0;
  let testimonialLastTime = 0;
  let testimonialHovered = false;
  let testimonialTouched = false;
  let testimonialPauseUntil = 0;
  function measureTestimonialLoop() {
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    testimonialLoopWidth = originalColumns.reduce((total, column) => total + column.offsetWidth + gap, 0);
    testimonialPosition = track.scrollLeft;
  }
  function setupTestimonialLoop() {
    track.querySelectorAll('[data-loop-copy]').forEach(column => column.remove());
    track.classList.toggle('is-looping', !testimonialMotion.matches);
    if (!testimonialMotion.matches) {
      originalColumns.forEach(column => {
        const copy = column.cloneNode(true);
        copy.dataset.loopCopy = 'true';
        copy.setAttribute('aria-hidden', 'true');
        copy.inert = true;
        copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        copy.querySelectorAll('[data-video-index]').forEach(el => el.removeAttribute('data-video-index'));
        copy.querySelectorAll('video').forEach(video => {
          video.autoplay = true;
          video.muted = true;
          video.defaultMuted = true;
          video.loop = true;
          video.playsInline = true;
          video.controls = false;
          video.play().catch(() => {});
        });
        track.append(copy);
      });
    }
    measureTestimonialLoop();
    updateGalleryButtons();
  }
  function shiftTestimonials(direction) {
    const column = originalColumns[0];
    if (!column) return;
    testimonialPauseUntil = performance.now() + 2500;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    let next = track.scrollLeft + direction * (column.clientWidth + gap);
    if (!testimonialMotion.matches && testimonialLoopWidth > 0) {
      if (next < 0) { track.scrollLeft += testimonialLoopWidth; next += testimonialLoopWidth; }
      next %= testimonialLoopWidth;
    }
    track.scrollTo({ left: next, behavior: testimonialMotion.matches ? 'auto' : 'smooth' });
  }
  const prevBtn = document.querySelector('#testimonial-prev');
  const nextBtn = document.querySelector('#testimonial-next');
  if (prevBtn) prevBtn.addEventListener('click', () => shiftTestimonials(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => shiftTestimonials(1));
  function updateGalleryButtons() {
    const looping = !testimonialMotion.matches && originalColumns.length > 1;
    const navDiv = document.querySelector('.testimonial-nav>div');
    if (navDiv) navDiv.hidden = track.scrollWidth <= track.clientWidth + 2;
    if (prevBtn) prevBtn.disabled = !looping && track.scrollLeft <= 1;
    if (nextBtn) nextBtn.disabled = !looping && track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }
  track.addEventListener('scroll', () => { testimonialPosition = track.scrollLeft; updateGalleryButtons(); }, { passive: true });
  track.addEventListener('mouseenter', () => { testimonialHovered = true; });
  track.addEventListener('mouseleave', () => { testimonialHovered = false; });
  track.addEventListener('pointerdown', e => {
    if (e.target.closest('.video-sound-toggle')) return;
    testimonialTouched = true;
  });
  window.addEventListener('pointerup', () => { testimonialTouched = false; testimonialPauseUntil = performance.now() + 1500; });
  window.addEventListener('pointercancel', () => { testimonialTouched = false; });
  track.addEventListener('wheel', () => { testimonialPauseUntil = performance.now() + 1500; }, { passive: true });
  window.addEventListener('resize', measureTestimonialLoop);
  testimonialMotion.addEventListener('change', setupTestimonialLoop);
  function animateTestimonials(time) {
    const delta = testimonialLastTime ? Math.min(time - testimonialLastTime, 50) : 0;
    testimonialLastTime = time;
    const playingVideo = [...track.querySelectorAll('video')].some(video => !video.paused && !video.ended && !video.muted);
    if (!testimonialMotion.matches && !document.hidden && !testimonialHovered && !testimonialTouched && !track.contains(document.activeElement) && !playingVideo && time >= testimonialPauseUntil && testimonialLoopWidth > 0) {
      testimonialPosition = (testimonialPosition + delta * 0.022) % testimonialLoopWidth;
      track.scrollLeft = testimonialPosition;
    }
    testimonialFrame = requestAnimationFrame(animateTestimonials);
  }
  setupTestimonialLoop();
  testimonialFrame = requestAnimationFrame(animateTestimonials);
  const triggerAutoplayOnGesture = () => {
    track.querySelectorAll('video').forEach(v => {
      if (v.paused && v.muted) v.play().catch(() => {});
    });
  };
  window.addEventListener('touchstart', triggerAutoplayOnGesture, { once: true, passive: true });
  window.addEventListener('click', triggerAutoplayOnGesture, { once: true, passive: true });
}
// Every WhatsApp CTA shares one regional contact picker.
const contactRegionNumbers = {
  surabaya: '6281284584489',
  jakarta: '6281213957045',
  bali: '6287724837861'
};
const contactRegionModal = document.querySelector('#contact-region-modal');
let contactRegionReturnFocus = null;

function openContactRegionModal(message = '') {
  if (!contactRegionModal) return;
  if (!contactRegionModal.open) contactRegionReturnFocus = document.activeElement;
  contactRegionModal.querySelectorAll('[data-contact-region]').forEach(link => {
    const number = contactRegionNumbers[link.dataset.contactRegion];
    const url = new URL(`https://wa.me/${number}`);
    if (message) url.searchParams.set('text', message);
    link.href = url.href;
  });
  if (!contactRegionModal.open) contactRegionModal.showModal();
  document.body.classList.add('contact-region-modal-open');
}

if (contactRegionModal) {
  contactRegionModal.querySelector('[data-close-contact-modal]').addEventListener('click', () => contactRegionModal.close());
  contactRegionModal.querySelectorAll('[data-contact-region]').forEach(link => {
    link.addEventListener('click', () => contactRegionModal.close());
  });
  contactRegionModal.addEventListener('click', event => {
    if (event.target !== contactRegionModal) return;
    const bounds = contactRegionModal.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      contactRegionModal.close();
    }
  });
  contactRegionModal.addEventListener('close', () => {
    document.body.classList.remove('contact-region-modal-open');
    if (contactRegionReturnFocus?.isConnected) contactRegionReturnFocus.focus({ preventScroll: true });
    contactRegionReturnFocus = null;
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || contactRegionModal.contains(link)) return;
    const url = new URL(link.href, window.location.href);
    if (!['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) return;
    event.preventDefault();
    openContactRegionModal(url.searchParams.get('text') || '');
  });
}

const whatsappNumber = '6281284584489';
const calculatorForm = document.querySelector('#calculator-form');
if (calculatorForm) {
  const calculatorName = document.querySelector('#calc-name');
  const calculatorAge = document.querySelector('#calc-age');
  const storedProfileKey = 'aformosa-calculator-profile-v1';
  try { const saved = JSON.parse(localStorage.getItem(storedProfileKey) || 'null'); if (saved && typeof saved === 'object') { if (typeof saved.name === 'string') calculatorName.value = saved.name.slice(0, 60); if (Number.isInteger(saved.age) && saved.age >= 20 && saved.age <= 100) calculatorAge.value = String(saved.age); } } catch (error) { }
  function saveCalculatorProfile() { try { localStorage.setItem(storedProfileKey, JSON.stringify({ name: calculatorName.value.trim().slice(0, 60), age: Number(calculatorAge.value) || null })); } catch (error) { } }
  function hideCalculatorResult() { document.querySelector('#calculator-output').hidden = true; document.querySelector('#calculator-empty').hidden = false; }
  calculatorName.addEventListener('input', () => { saveCalculatorProfile(); hideCalculatorResult(); });
  calculatorAge.addEventListener('input', () => { saveCalculatorProfile(); hideCalculatorResult(); });
  document.querySelectorAll('#calc-sex,#calc-height,#calc-weight,#calc-activity').forEach(field => field.addEventListener('input', hideCalculatorResult));
  const calcActivityEl = document.querySelector('#calc-activity');
  const activityHintEl = document.querySelector('#activity-hint');
  if (calcActivityEl && activityHintEl) {
    calcActivityEl.addEventListener('change', event => {
      activityHintEl.textContent = event.target.value
        ? event.target.selectedOptions?.[0]?.textContent || 'Pilih yang paling mendekati rutinitasmu selama seminggu.'
        : 'Pilih yang paling mendekati rutinitasmu selama seminggu.';
    });
  }
  const clearProfileBtn = document.querySelector('#clear-saved-profile');
  if (clearProfileBtn) {
    clearProfileBtn.addEventListener('click', () => {
      try { localStorage.removeItem(storedProfileKey); } catch (error) { }
      calculatorName.value = '';
      calculatorAge.value = '';
      hideCalculatorResult();
      calculatorName.focus();
    });
  }
  const activityLevels = {
    sedentary: { label: 'Sedentari — sedikit atau tanpa olahraga', factor: 1.2 },
    light: { label: 'Olahraga 1–3 kali per minggu', factor: 1.375 },
    moderate: { label: 'Olahraga 4–5 kali per minggu', factor: 1.465 },
    daily: { label: 'Olahraga setiap hari / intens 3–4 kali per minggu', factor: 1.55 },
    intense: { label: 'Olahraga intens 6–7 kali per minggu', factor: 1.725 },
    'very-intense': { label: 'Olahraga sangat intens tiap hari / pekerjaan fisik', factor: 1.9 }
  };
  calculatorForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!calculatorForm.reportValidity()) return;
    const name = calculatorName.value.trim().replace(/\s+/g, ' ');
    if (!name) { calculatorName.setCustomValidity('Masukkan nama terlebih dahulu.'); calculatorName.reportValidity(); return; }
    calculatorName.setCustomValidity('');
    const age = Number(calculatorAge.value);
    const height = Number(document.querySelector('#calc-height').value);
    const weight = Number(document.querySelector('#calc-weight').value);
    const sex = document.querySelector('#calc-sex').value;
    const activity = activityLevels[document.querySelector('#calc-activity').value];
    if (!Number.isInteger(age) || age < 20 || age > 100 || !Number.isFinite(height) || height < 100 || height > 250 || !Number.isFinite(weight) || weight < 25 || weight > 350 || !['female', 'male'].includes(sex) || !activity) return;
    saveCalculatorProfile();
    const bmi = weight / Math.pow(height / 100, 2);
    const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
    const tdee = bmr * activity.factor;
    const category = bmi < 18.5 ? 'Berat badan kurang' : bmi < 25 ? 'Rentang berat badan sehat' : bmi < 30 ? 'Berat badan berlebih' : 'Obesitas';
    const bmiDisplay = bmi.toFixed(1).replace('.', ',');
    const bmrDisplay = Math.round(bmr).toLocaleString('id-ID');
    const tdeeDisplay = Math.round(tdee).toLocaleString('id-ID');
    document.querySelector('#bmi-value').textContent = bmiDisplay;
    document.querySelector('#bmi-category').textContent = category;
    document.querySelector('#bmr-value').textContent = bmrDisplay;
    document.querySelector('#tdee-value').textContent = tdeeDisplay;
    document.querySelector('#activity-result-label').textContent = activity.label;
    document.querySelector('#calculator-empty').hidden = true;
    document.querySelector('#calculator-output').hidden = false;
    const message = `Halo Aformosa, saya ${name}, ${age} tahun. Saya ingin konsultasi program makan sehat berdasarkan hasil kalkulator:\n\nTinggi: ${height} cm\nBerat: ${weight} kg\nBMI: ${bmiDisplay} (${category})\nPerkiraan BMR: ${bmrDisplay} kkal/hari\nAktivitas: ${activity.label}\nPerkiraan kalori harian: ${tdeeDisplay} kkal/hari\n\nBoleh dibantu rekomendasi program, menu, dan harganya?`;
    document.querySelector('#calculator-whatsapp').href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    requestAnimationFrame(() => {
      document.querySelector('.calculator-results').scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
  calculatorName.addEventListener('input', () => calculatorName.setCustomValidity(''));
}

const deliveryForm = document.querySelector('#delivery-form');
if (deliveryForm) {
  deliveryForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!deliveryForm.reportValidity()) return;
    const cityEl = document.querySelector('#delivery-city');
    const needEl = document.querySelector('#delivery-goal');
    const city = cityEl ? cityEl.value : '';
    const need = needEl ? needEl.value : '';
    if (!city) return;
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
    const message = `Halo Aformosa, saya ingin konsultasi catering sehat.\n\nKota pengiriman: ${formattedCity}\nKebutuhan / paket: ${need}\n\nBoleh dibantu info menu, harga, durasi paket, dan jadwal pengirimannya?`;
    const region = city === 'tangerang' ? 'jakarta' : city;
    const number = contactRegionNumbers[region];
    if (!number) return;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
}

// Reusable Custom Select Component
function initCustomSelects() {
  const wrappers = () => document.querySelectorAll('[data-custom-select]');
  const closeAll = except => wrappers().forEach(wrapper => {
    if (wrapper !== except) wrapper._closeCustomSelect?.();
  });

  wrappers().forEach(wrapper => {
    if (wrapper.dataset.initialized === 'true') return;
    const nativeSelect = wrapper.querySelector('select');
    const trigger = wrapper.querySelector('.custom-select__trigger');
    const valueEl = wrapper.querySelector('.custom-select__value');
    const menu = wrapper.querySelector('.custom-select__menu');
    const options = Array.from(menu?.querySelectorAll('.custom-select__option') || []);
    if (!nativeSelect || !trigger || !valueEl || !menu || !options.length) return;
    wrapper.dataset.initialized = 'true';
    nativeSelect.classList.add('native-select-source');
    trigger.id ||= `${nativeSelect.id}-trigger`;
    menu.id ||= `${nativeSelect.id}-listbox`;
    trigger.setAttribute('aria-controls', menu.id);
    menu.setAttribute('aria-labelledby', trigger.id);
    options.forEach(option => { option.tabIndex = -1; });
    let highlightedIndex = -1;

    function highlight(index) {
      highlightedIndex = index;
      options.forEach((option, i) => option.classList.toggle('is-highlighted', i === index));
      if (index >= 0) {
        options[index].id ||= `${menu.id}-option-${index}`;
        trigger.setAttribute('aria-activedescendant', options[index].id);
        options[index].scrollIntoView({ block: 'nearest' });
      } else {
        trigger.removeAttribute('aria-activedescendant');
      }
    }

    function syncFromNative() {
      const selected = options.find(option => option.dataset.value === nativeSelect.value);
      if (selected) {
        valueEl.textContent = selected.textContent.trim();
        valueEl.classList.toggle('is-placeholder', nativeSelect.value === '');
      }
      options.forEach(option => {
        const isSelected = option === selected;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
      });
      if (nativeSelect.validity.valid) trigger.classList.remove('has-error');
    }

    function close() {
      wrapper.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      highlight(-1);
    }

    function open() {
      closeAll(wrapper);
      wrapper.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      const index = options.findIndex(option => option.dataset.value === nativeSelect.value);
      highlight(index < 0 ? 0 : index);
    }

    function choose(option) {
      nativeSelect.value = option.dataset.value ?? '';
      syncFromNative();
      nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      close();
      trigger.focus();
    }

    wrapper._closeCustomSelect = close;
    trigger.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      wrapper.classList.contains('is-open') ? close() : open();
    });
    options.forEach((option, index) => {
      option.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        choose(option);
      });
      option.addEventListener('mouseenter', () => highlight(index));
    });
    wrapper.addEventListener('keydown', event => {
      const isOpen = wrapper.classList.contains('is-open');
      if (event.key === 'Escape') {
        if (isOpen) {
          event.preventDefault();
          close();
          trigger.focus();
        }
      } else if (event.key === 'Tab') {
        close();
      } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (!isOpen) open();
        else if (event.key === 'ArrowDown') highlight((highlightedIndex + 1) % options.length);
        else if (event.key === 'ArrowUp') highlight((highlightedIndex - 1 + options.length) % options.length);
        if (event.key === 'Home') highlight(0);
        if (event.key === 'End') highlight(options.length - 1);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!isOpen) open();
        else if (highlightedIndex >= 0) choose(options[highlightedIndex]);
      }
    });
    nativeSelect.addEventListener('change', syncFromNative);
    nativeSelect.addEventListener('focus', () => trigger.focus());
    nativeSelect.addEventListener('invalid', event => {
      event.preventDefault();
      trigger.classList.add('has-error');
      trigger.focus();
    });
    nativeSelect.form?.addEventListener('reset', () => {
      queueMicrotask(() => {
        syncFromNative();
        trigger.classList.remove('has-error');
        close();
      });
    });
    syncFromNative();
    close();
  });

  if (initCustomSelects.listenersAttached) return;
  initCustomSelects.listenersAttached = true;
  document.addEventListener('click', event => {
    if (!event.target.closest('[data-custom-select]')) closeAll();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAll();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSelects);
} else {
  initCustomSelects();
}
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

if (nav) {
  const visibleSections = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(a => {
          if (a.hash) a.classList.toggle('active', a.hash === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-18% 0px -64% 0px' });

  nav.querySelectorAll('a').forEach(a => {
    if (a.hash && a.hash.startsWith('#')) {
      const section = document.querySelector(a.hash);
      if (section) visibleSections.observe(section);
    }
  });
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    if (document.querySelector('.hero-copy')) {
      gsap.from('.hero-copy', { opacity: 0, y: 20, duration: .6, ease: 'power2.out' });
    }
    if (document.querySelector('.hero-visual')) {
      gsap.from('.hero-visual', { opacity: 0, scale: .94, duration: .8, ease: 'power2.out' });
    }
    document.querySelectorAll('.section-heading').forEach(el => gsap.from(el, { y: 20, opacity: 0, duration: .6, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    const paragraph = document.querySelector('.reveal-words');
    let original = '';
    if (paragraph) {
      original = paragraph.textContent;
      paragraph.setAttribute('aria-label', original);
      paragraph.innerHTML = '';
      original.split(' ').forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.setAttribute('aria-hidden', 'true');
        paragraph.append(span);
      });
      gsap.fromTo(paragraph.children, { opacity: .25 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: paragraph, start: 'top 85%', end: 'bottom 55%', scrub: true } });
    }
    const desktop = gsap.matchMedia();
    desktop.add('(min-width: 951px)', () => {
      document.querySelectorAll('.step').forEach((card, index) => {
        if (index < 3) ScrollTrigger.create({ trigger: card, start: 'top ' + (126 + index * 12) + 'px', endTrigger: '.steps', end: 'bottom 340px', pin: true, pinSpacing: false });
      });
    });
    return () => {
      desktop.revert();
      if (paragraph && original) paragraph.textContent = original;
    };
  });
}
