'use strict';
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#navigation');
function closeNav() { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Buka navigasi'); }
navToggle.addEventListener('click', () => { const open = navToggle.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); navToggle.setAttribute('aria-expanded', String(open)); navToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeNav(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeNav(); });
const menuData = {
  batch: 367, start: '2026-10-05', end: '2026-10-10', days: [
    { day: 'Senin', date: '2026-10-05', image: 1, lunch: { name: 'Ayam Saus Kacang', description: 'Nasi merah, tumis sayur & puding', kcal: 565 }, dinner: { name: 'Baked Cheese Omelette', description: 'Jagung, sayuran & buah', kcal: 558 } },
    { day: 'Selasa', date: '2026-10-06', image: 2, lunch: { name: 'Spaghetti Chicken Mushroom', description: 'Pasta, ayam jamur & bayam', kcal: 582 }, dinner: { name: 'Chicken Meatball', description: 'Mashed potato, sayur & buah', kcal: 560 } },
    { day: 'Rabu', date: '2026-10-07', image: 3, lunch: { name: 'Ayam Sambal Matah', description: 'Nasi merah, buncis & puding', kcal: 575 }, dinner: { name: 'Siomay Bandung', description: 'Bihun, kentang, sayur & buah', kcal: 552 } },
    { day: 'Kamis', date: '2026-10-08', image: 4, lunch: { name: 'Classic Fish & Chips', description: 'Potato wedges, sayur & puding', kcal: 580 }, dinner: { name: 'Tuna & Egg Salad', description: 'Garlic bread, salad & buah', kcal: 568 } },
    { day: 'Jumat', date: '2026-10-09', image: 5, lunch: { name: 'Healthy Ketoprak', description: 'Tahu, telur, bihun & sayuran', kcal: 555 }, dinner: { name: 'Golden Chicken', description: 'Nasi merah, bayam & puding', kcal: 588 } },
    { day: 'Sabtu', date: '2026-10-10', image: 6, lunch: { name: 'Chicken Katsu Salad', description: 'Ubi, telur, edamame & buah', kcal: 570 }, dinner: { name: 'Chicken & Scrambled Egg', description: 'Nasi merah, wortel & sayuran', kcal: 590 } }
  ]
};
const smallIcons = { lunch: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>', dinner: '<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z"/>' };
const weeklyMenu = document.querySelector('#weekly-menu');
menuData.days.forEach(day => {
  const card = document.createElement('article'); card.className = 'menu-card';
  card.innerHTML = `<div class="menu-card-heading"><span class="day-pill">${day.day}</span><time datetime="${day.date}">${new Date(day.date + 'T12:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time></div><div class="menu-photo"><img src="${day.image === 1 ? 'assets/hero-studio.jpg' : 'assets/menu-studio-' + day.image + '.jpg'}" alt="Visual penyajian menu Aformosa untuk ${day.day}" width="1024" height="1536" loading="lazy"></div><div class="meal-details">${['lunch', 'dinner'].map(type => `<div data-meal="${type}"><span class="meal-type"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">${smallIcons[type]}</svg>${type === 'lunch' ? 'Makan siang' : 'Makan malam'}</span><h3>${day[type].name}</h3><p>${day[type].description}</p><span class="kcal">${day[type].kcal} kkal</span></div>`).join('')}</div>`;
  weeklyMenu.append(card);
});
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
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
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
document.querySelector('#testimonial-prev').addEventListener('click', () => shiftTestimonials(-1));
document.querySelector('#testimonial-next').addEventListener('click', () => shiftTestimonials(1));
function updateGalleryButtons() {
  const looping = !testimonialMotion.matches && originalColumns.length > 1;
  document.querySelector('.testimonial-nav>div').hidden = track.scrollWidth <= track.clientWidth + 2;
  document.querySelector('#testimonial-prev').disabled = !looping && track.scrollLeft <= 1;
  document.querySelector('#testimonial-next').disabled = !looping && track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
}
track.addEventListener('scroll', () => { testimonialPosition = track.scrollLeft; updateGalleryButtons(); }, { passive: true });
track.addEventListener('mouseenter', () => { testimonialHovered = true; });
track.addEventListener('mouseleave', () => { testimonialHovered = false; });
track.addEventListener('pointerdown', () => { testimonialTouched = true; });
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
const whatsappNumber = '6281284584489';
const calculatorForm = document.querySelector('#calculator-form');
const calculatorName = document.querySelector('#calc-name');
const calculatorAge = document.querySelector('#calc-age');
const storedProfileKey = 'aformosa-calculator-profile-v1';
try { const saved = JSON.parse(localStorage.getItem(storedProfileKey) || 'null'); if (saved && typeof saved === 'object') { if (typeof saved.name === 'string') calculatorName.value = saved.name.slice(0, 60); if (Number.isInteger(saved.age) && saved.age >= 20 && saved.age <= 100) calculatorAge.value = String(saved.age); } } catch (error) { }
function saveCalculatorProfile() { try { localStorage.setItem(storedProfileKey, JSON.stringify({ name: calculatorName.value.trim().slice(0, 60), age: Number(calculatorAge.value) || null })); } catch (error) { } }
function hideCalculatorResult() { document.querySelector('#calculator-output').hidden = true; document.querySelector('#calculator-empty').hidden = false; }
calculatorName.addEventListener('input', () => { saveCalculatorProfile(); hideCalculatorResult(); });
calculatorAge.addEventListener('input', () => { saveCalculatorProfile(); hideCalculatorResult(); });
document.querySelectorAll('#calc-sex,#calc-height,#calc-weight,#calc-activity').forEach(field => field.addEventListener('input', hideCalculatorResult));
document.querySelector('#calc-activity').addEventListener('change', event => { document.querySelector('#activity-hint').textContent = event.target.value ? event.target.selectedOptions[0].textContent : 'Pilih yang paling mendekati rutinitasmu selama seminggu.'; });
document.querySelector('#clear-saved-profile').addEventListener('click', () => { try { localStorage.removeItem(storedProfileKey); } catch (error) { } calculatorName.value = ''; calculatorAge.value = ''; hideCalculatorResult(); calculatorName.focus(); });
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

document.querySelector('#consult-form').addEventListener('submit', e => {
  e.preventDefault(); if (!e.target.reportValidity()) return;
  const city = document.querySelector('#city').value; const goal = document.querySelector('#goal').value;
  const message = `Halo Aformosa, saya berada di ${city} dan tertarik dengan ${goal}. Boleh dibantu info menu, pilihan Full Meal / One Meal, harga, durasi, dan cakupan pengirimannya?`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
document.querySelector('#year').textContent = new Date().getFullYear();
const visibleSections = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id)); } }); }, { rootMargin: '-18% 0px -64% 0px' });
nav.querySelectorAll('a').forEach(a => { const section = document.querySelector(a.hash); if (section) visibleSections.observe(section); });
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero-copy', { opacity: 0, y: 20, duration: .6, ease: 'power2.out' });
    gsap.from('.hero-visual', { opacity: 0, scale: .94, duration: .8, ease: 'power2.out' });
    document.querySelectorAll('.section-heading').forEach(el => gsap.from(el, { y: 20, opacity: 0, duration: .6, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    const paragraph = document.querySelector('.reveal-words'); const original = paragraph.textContent;
    paragraph.setAttribute('aria-label', original); paragraph.innerHTML = ''; original.split(' ').forEach(word => { const span = document.createElement('span'); span.textContent = word + ' '; span.setAttribute('aria-hidden', 'true'); paragraph.append(span); });
    gsap.fromTo(paragraph.children, { opacity: .25 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: paragraph, start: 'top 85%', end: 'bottom 55%', scrub: true } });
    const desktop = gsap.matchMedia(); desktop.add('(min-width: 951px)', () => { document.querySelectorAll('.step').forEach((card, index) => { if (index < 3) ScrollTrigger.create({ trigger: card, start: 'top ' + (126 + index * 12) + 'px', endTrigger: '.steps', end: 'bottom 340px', pin: true, pinSpacing: false }); }); });
    return () => { desktop.revert(); paragraph.textContent = original; };
  });
}
