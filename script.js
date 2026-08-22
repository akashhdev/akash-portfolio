const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');
const revealItems = document.querySelectorAll('.reveal');

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const filterGroup = document.querySelector('[data-project-filters]');
const projectCards = document.querySelectorAll('[data-project-grid] [data-category]');
const emptyFilter = document.querySelector('[data-empty-filter]');

if (filterGroup && projectCards.length) {
  filterGroup.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;

    const selected = button.dataset.filter;
    let visibleCount = 0;

    filterGroup.querySelectorAll('[data-filter]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });

    projectCards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.category === selected;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (emptyFilter) emptyFilter.hidden = visibleCount !== 0;
  });
}
