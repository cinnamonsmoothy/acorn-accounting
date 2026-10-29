const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');
const pageLoader = document.querySelector('.page-loader');
if (pageLoader) {
  const loaderStartedAt = performance.now();
  let pageTransitioning = false;
  let pageVisible = false;
  const growWord = document.querySelector('.grow-word');
  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const loaderDuration = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : window.innerWidth <= 900 ? 350 : 490;
  const startGrowWhenVisible = () => {
    if (!pageVisible || !growWord || document.documentElement.classList.contains('grow-animation-started')) return;
    const bounds = growWord.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
    document.documentElement.classList.add('grow-animation-started');
    window.removeEventListener('scroll', startGrowWhenVisible);
  };
  const finishPageReveal = () => {
    if (!pageLoader.classList.contains('is-hidden') || pageLoader.getBoundingClientRect().bottom > 0) return;
    pageVisible = true;
    startGrowWhenVisible();
  };
  const hideLoader = () => {
    pageLoader.classList.add('is-hidden');
    window.setTimeout(finishPageReveal, loaderDuration() + 50);
  };
  pageLoader.addEventListener('transitionend', (event) => {
    if (event.target === pageLoader && event.propertyName === 'transform') finishPageReveal();
  });
  window.addEventListener('scroll', startGrowWhenVisible, { passive: true });
  const revealInitialPage = () => {
    const minimumTime = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : window.innerWidth <= 900 ? 320 : 760;
    window.setTimeout(hideLoader, Math.max(0, minimumTime - (performance.now() - loaderStartedAt)));
  };
  if (document.readyState === 'complete') revealInitialPage();
  else window.addEventListener('load', revealInitialPage, { once: true });

  document.addEventListener('click', async (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || link.target === '_blank' || pageTransitioning) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || !['http:', 'https:', 'file:'].includes(destination.protocol)) return;
    const sameDocument = destination.pathname === window.location.pathname && destination.search === window.location.search;
    if (sameDocument && !destination.hash) return;
    const target = sameDocument ? document.getElementById(decodeURIComponent(destination.hash.slice(1))) : null;
    if (sameDocument && !target) return;
    event.preventDefault();
    pageTransitioning = true;
    pageVisible = false;
    pageLoader.classList.remove('is-hidden');
    pageLoader.classList.add('is-preparing');
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    pageLoader.classList.remove('is-preparing');
    await wait(loaderDuration());
    if (!sameDocument) {
      window.location.assign(destination.href);
      return;
    }
    history.pushState(null, '', destination.hash);
    window.scrollTo({
      top: target === header ? 0 : target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0),
      behavior: 'instant'
    });
    await wait(80);
    hideLoader();
    window.setTimeout(() => { pageTransitioning = false; }, loaderDuration() + 40);
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      pageLoader.classList.remove('is-preparing');
      pageLoader.classList.add('is-hidden');
      pageTransitioning = false;
      window.setTimeout(finishPageReveal, 30);
    }
  });
}
const hero = document.querySelector('.hero');
const about = document.querySelector('.about');
const aboutInner = document.querySelector('.about-inner');
const aboutLeaf = document.querySelector('.about-falling-leaf');
const leafFlight = document.querySelector('#about-leaf-flight-path');
const leafFlightLength = leafFlight?.getTotalLength() || 0;

let heroFadeFrame = 0;
const updateHeroExitFade = () => {
  heroFadeFrame = 0;
  if (!hero || !about) return;
  const aboutTop = about.getBoundingClientRect().top + window.scrollY;
  const fadeStart = hero.offsetHeight * 0.2;
  const fadeEnd = Math.max(fadeStart + 1, aboutTop - window.innerHeight * 0.35);
  const progress = Math.max(0, Math.min(1, (window.scrollY - fadeStart) / (fadeEnd - fadeStart)));
  document.documentElement.style.setProperty('--hero-exit-fade', String(progress * progress * (3 - 2 * progress)));
  if (window.innerWidth <= 900) {
    aboutInner?.style.setProperty('--about-exit-opacity', '1');
    return;
  }
  const holdDistance = Math.max(0, about.offsetHeight - window.innerHeight);
  const aboutExitStart = aboutTop + holdDistance;
  const aboutExitEnd = aboutExitStart + window.innerHeight * 0.35;
  const exitProgress = Math.max(0, Math.min(1, (window.scrollY - aboutExitStart) / (aboutExitEnd - aboutExitStart)));
  const exitEase = exitProgress * exitProgress * (3 - 2 * exitProgress);
  aboutInner?.style.setProperty('--about-exit-opacity', String(1 - exitEase));

  if (aboutLeaf && leafFlightLength && window.innerWidth > 900 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const leafStart = aboutTop - window.innerHeight * 0.15;
    const leafEnd = aboutExitStart + window.innerHeight * 0.25;
    const leafProgress = Math.max(0, Math.min(1, (window.scrollY - leafStart) / (leafEnd - leafStart)));
    const point = leafFlight.getPointAtLength(leafProgress * leafFlightLength);
    const gutter = window.innerWidth - aboutInner.getBoundingClientRect().right;
    const right = Math.max(8, gutter * 0.08);
    const leafWidth = parseFloat(getComputedStyle(aboutLeaf).width) || 34;
    const windRoom = Math.max(0, gutter - right - leafWidth - 8);
    const x = -(1 - point.x / 100) * windRoom;
    const y = point.y / 100 * window.innerHeight;
    const angle = -25 + leafProgress * 370 + Math.sin(leafProgress * Math.PI * 8) * 16;
    const opacity = Math.max(0, Math.min(1, leafProgress / 0.1, (1 - leafProgress) / 0.18));
    aboutLeaf.style.right = `${right}px`;
    aboutLeaf.style.transform = `translate3d(${x}px,${y}px,0px) rotate(${angle}deg)`;
    aboutLeaf.style.opacity = String(opacity);
  }
};
const scheduleHeroExitFade = () => {
  if (!heroFadeFrame) heroFadeFrame = requestAnimationFrame(updateHeroExitFade);
};
updateHeroExitFade();
window.addEventListener('scroll', scheduleHeroExitFade, { passive: true });
window.addEventListener('resize', scheduleHeroExitFade);
window.addEventListener('pageshow', scheduleHeroExitFade);

const revealElements = document.querySelectorAll('.about [data-about-reveal], [data-reveal]');
if (revealElements.length && 'IntersectionObserver' in window && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.documentElement.classList.add('has-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
}

const servicesSection = document.querySelector('.services');
if (servicesSection) {
  let servicesSnapTimer = 0;
  let assistingServices = false;
  const gentlyCentreServices = () => {
    if (assistingServices || window.innerWidth <= 900 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = servicesSection.getBoundingClientRect();
    const headerHeight = header?.getBoundingClientRect().height || 0;
    if (bounds.height > window.innerHeight - headerHeight + 20) return;
    const distance = bounds.top + bounds.height / 2 - (window.innerHeight + headerHeight) / 2;
    if (Math.abs(distance) < 8 || Math.abs(distance) > 48) return;
    assistingServices = true;
    window.scrollBy({ top: distance, behavior: 'smooth' });
    window.setTimeout(() => { assistingServices = false; }, 550);
  };
  window.addEventListener('scroll', () => {
    window.clearTimeout(servicesSnapTimer);
    servicesSnapTimer = window.setTimeout(gentlyCentreServices, 180);
  }, { passive: true });
}

const industryReel = document.querySelector('.industry-reel');
const reelTrack = industryReel?.querySelector('.industry-reel-track');
if (industryReel && reelTrack && 'IntersectionObserver' in window && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const reelItems = Array.from(reelTrack.children);
  let reelIndex = 0;
  let reelTimer;
  const positionIndustry = () => {
    reelItems.forEach((item, index) => {
      const forward = (index - reelIndex + reelItems.length) % reelItems.length;
      const distance = forward <= reelItems.length / 2 ? forward : forward - reelItems.length;
      item.className = 'industry-reel-item';
      if (distance === 0) item.classList.add('is-current');
      else if (distance === -1) item.classList.add('is-previous');
      else if (distance === 1) item.classList.add('is-next');
      else if (distance === -2) item.classList.add('is-before');
      else if (distance === 2) item.classList.add('is-after');
    });
  };
  const advanceIndustry = () => {
    reelIndex = (reelIndex + 1) % reelItems.length;
    positionIndustry();
  };
  positionIndustry();
  const reelObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !reelTimer) reelTimer = window.setInterval(advanceIndustry, 950);
    if (!entries[0].isIntersecting && reelTimer) {
      window.clearInterval(reelTimer);
      reelTimer = undefined;
    }
  }, { threshold: 0.1 });
  reelObserver.observe(industryReel);
}

const testimonialViewport = document.querySelector('.testimonial-viewport');
if (testimonialViewport) {
  const slides = Array.from(testimonialViewport.querySelectorAll('.testimonial-slide'));
  const carousel = testimonialViewport.closest('.testimonial-carousel');
  const count = carousel.querySelector('.testimonial-count');
  let activeIndex = 0;
  let scrollFrame = 0;
  const updateReview = () => {
    scrollFrame = 0;
    const centre = testimonialViewport.scrollLeft + testimonialViewport.clientWidth / 2;
    activeIndex = slides.reduce((closest, slide, index) =>
      Math.abs(slide.offsetLeft + slide.clientWidth / 2 - centre) < Math.abs(slides[closest].offsetLeft + slides[closest].clientWidth / 2 - centre) ? index : closest, 0);
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === activeIndex));
    count.innerHTML = `${String(activeIndex + 1).padStart(2, '0')} <span>/ ${String(slides.length).padStart(2, '0')}</span>`;
  };
  const showReview = (index) => {
    const slide = slides[(index + slides.length) % slides.length];
    testimonialViewport.scrollTo({
      left: slide.offsetLeft - (testimonialViewport.clientWidth - slide.clientWidth) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };
  carousel.querySelectorAll('.testimonial-arrow').forEach((button) => button.addEventListener('click', () => {
    showReview(activeIndex + (button.dataset.direction === 'next' ? 1 : -1));
  }));
  testimonialViewport.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showReview(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  testimonialViewport.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateReview);
  }, { passive: true });
  window.addEventListener('resize', updateReview);
  updateReview();
}

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 0);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('pageshow', updateHeader);

const mobilePhotoCurve = document.querySelector('#hero-rounded-photo-mobile-path');
const heroArt = document.querySelector('.hero-art');
const benefits = document.querySelector('.benefits');
const benefitsWave = document.querySelector('.benefits-wave');

const syncMobileHeroCurve = () => {
  if (!mobilePhotoCurve || !heroArt || !benefits || !benefitsWave || window.innerWidth > 900) return;
  const artBounds = heroArt.getBoundingClientRect();
  const bannerBounds = benefitsWave.getBoundingClientRect();
  const artScale = artBounds.width / 1457;
  const bannerHeight = bannerBounds.height;
  const curveDepth = bannerHeight * 42.5 / 310;
  const photoOverlap = curveDepth + 1;
  const bannerOverlap = photoOverlap - 12;
  const bannerYAt = (artX) => {
    const bannerX = artBounds.left - bannerBounds.left + artX * artScale;
    const position = bannerX / bannerBounds.width;
    return 170 * position * (1 - position) * bannerHeight / 310;
  };
  const photoYAt = (artX) => 1080 + (bannerYAt(artX) - photoOverlap) / artScale;
  const leftY = photoYAt(0);
  const rightY = photoYAt(1380);
  const controlY = 2 * photoYAt(690) - (leftY + rightY) / 2;

  benefits.style.setProperty('--mobile-banner-overlap', `${bannerOverlap}px`);
  hero?.style.setProperty('--mobile-banner-overlap', `${bannerOverlap}px`);
  mobilePhotoCurve.setAttribute('d', `M790 25 A667 515 0 0 1 1457 540 C1457 760 1430 ${rightY - 40} 1380 ${rightY} Q690 ${controlY} 0 ${leftY} L123 540 A667 515 0 0 1 790 25Z`);
};

syncMobileHeroCurve();
window.addEventListener('resize', syncMobileHeroCurve);
if (window.ResizeObserver && benefits && heroArt) {
  const curveObserver = new ResizeObserver(syncMobileHeroCurve);
  curveObserver.observe(benefits);
  curveObserver.observe(heroArt);
}

let menuCloseTimer;
const setMenuOpen = (open, restoreFocus = false) => {
  window.clearTimeout(menuCloseTimer);
  const wasOpen = nav?.classList.contains('open');
  nav?.classList.toggle('open', open);
  header?.classList.toggle('menu-open', open);
  if (open) {
    header?.classList.remove('menu-closing');
    document.body.classList.add('menu-open');
  } else if (wasOpen) {
    header?.classList.add('menu-closing');
    menuCloseTimer = window.setTimeout(() => {
      header?.classList.remove('menu-closing');
      document.body.classList.remove('menu-open');
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 720);
  } else {
    header?.classList.remove('menu-closing');
    document.body.classList.remove('menu-open');
  }
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (restoreFocus) menuButton?.focus();
};

menuButton?.addEventListener('click', () => setMenuOpen(!nav?.classList.contains('open')));
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => {
  if (!nav?.classList.contains('open')) return;
  if (event.key === 'Escape') {
    setMenuOpen(false, true);
  } else if (event.key === 'Tab') {
    const focusable = [...nav.querySelectorAll('a'), menuButton];
    const current = focusable.indexOf(document.activeElement);
    if (event.shiftKey && current <= 0) {
      event.preventDefault();
      menuButton.focus();
    } else if (!event.shiftKey && current === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) setMenuOpen(false);
});

const faqDetails = [...document.querySelectorAll('.faq-list details')];
faqDetails.forEach((current) => current.addEventListener('toggle', () => {
  if (current.open) faqDetails.forEach((other) => { if (other !== current) other.open = false; });
}));

document.querySelector('#year').textContent = String(new Date().getFullYear());
