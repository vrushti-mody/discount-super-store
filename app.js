const gallery = [
  { category: 'souvenirs', label: 'Canadian souvenirs', imageIds: [1, 3, 4, 2, 10, 9, 11] },
  { category: 'travel', label: 'Travel & luggage', imageIds: [6, 25, 24, 22, 29, 28, 27, 30] },
  { category: 'maple', label: 'Maple treats', imageIds: [7, 5, 8, 14, 15, 16, 17] },
  { category: 'everyday', label: 'Everyday finds', imageIds: [26, 23, 19, 13, 12] }
];

document.querySelector('#product-grid').innerHTML = gallery.flatMap(({ category, label, imageIds }) =>
  imageIds.map((imageId, index) => {
    const imageUrl = `https://discountsuperstore.ca/static/img/gallery/${imageId}.webp`;
    const alt = `${label} from Discount Super Store, gallery image ${imageId}`;
    return `<article class="product-card" data-category="${category}">
      <button class="ask-item" data-product="${label}" aria-label="Ask about ${label}">↗</button>
      <a class="product-image" href="#ask" data-product-link="${label}">
        <img src="${imageUrl}" width="520" height="420" loading="lazy" alt="${alt}">
        <span class="product-badge">${label}</span>
      </a>
      <div class="product-info"><div><small>GALLERY FIND ${String(index + 1).padStart(2, '0')}</small><h3>${label}</h3></div>
      <a class="product-arrow" href="#ask" data-product-link="${label}" aria-label="Ask about ${label}">↗</a></div>
    </article>`;
  })
).join('');

document.querySelectorAll('[data-product]').forEach((el) => {
  el.addEventListener('click', () => document.querySelector('#ask').scrollIntoView({ behavior: 'smooth' }));
});

document.querySelectorAll('[data-filter]').forEach((el) => {
  el.addEventListener('click', (event) => {
    if (el.matches('button')) event.preventDefault();
    const category = el.dataset.filter;
    document.querySelectorAll('.filter').forEach((button) => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.product-card').forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
    });
    if (el.matches('.category-card')) document.querySelector('#finds').scrollIntoView({ behavior: 'smooth' });
  });
});

const searchInput = document.querySelector('#site-search');
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('.product-card').forEach((card) => {
      card.hidden = query.length > 0 && !card.textContent.toLowerCase().includes(query);
    });
  }, 180);
});
document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#finds').scrollIntoView({ behavior: 'smooth' });
});

const dialog = document.querySelector('#policy-dialog');
const policyTitle = document.querySelector('#policy-title');
const policyContent = document.querySelector('#policy-content');
const policies = {
  privacy: ['Privacy Policy', '<p><b>Last updated: November 2026</b></p><p>This website does not collect inquiry details through a contact form. If you call or visit the store, the store may receive information you choose to share directly with its staff.</p><p>This site uses essential browser storage for your cookie preference. No analytics or advertising trackers are currently enabled. If that changes, non-essential tracking will remain off until you opt in.</p><p>Questions about privacy? Contact the store at 692 Seymour St, Vancouver, BC V6B 3K3, or by phone at (604) 620-6421.</p>'],
  terms: ['Terms of Service', '<p>This website shares general information about Discount Super Store, its location and examples of product categories. Product selection, pricing and availability can change without notice. Contact or visit the store to confirm current details before making a trip.</p><p>Website content is provided for general information. External links are provided for convenience and are governed by their own terms and privacy practices. For questions about a purchase or this site, call (604) 620-6421 or visit 692 Seymour St, Vancouver, BC V6B 3K3.</p>'],
  returns: ['In-Store Returns & Exchanges', '<p>Return and exchange terms are confirmed at the point of purchase. Please ask a team member before buying and keep your receipt. We do not have verified public policy details to publish here; contact the store directly at <a href="tel:+16046206421">(604) 620-6421</a> for current information.</p>']
};
document.querySelectorAll('[data-policy]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  const [title, content] = policies[link.dataset.policy];
  policyTitle.textContent = title;
  policyContent.innerHTML = content;
  dialog.showModal();
}));
dialog.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const cookieBanner = document.querySelector('#cookie-banner');
const cookieChoice = localStorage.getItem('dss-cookie-choice');
if (!cookieChoice) cookieBanner.hidden = false;
document.querySelector('#cookie-accept').addEventListener('click', () => {
  localStorage.setItem('dss-cookie-choice', 'essential-only');
  cookieBanner.hidden = true;
});
document.querySelector('#cookie-manage').addEventListener('click', () => {
  localStorage.setItem('dss-cookie-choice', 'essential-only');
  cookieBanner.hidden = true;
  policyTitle.textContent = 'Cookie preferences';
  policyContent.innerHTML = '<p>Only essential browser storage is active on this website. It remembers that you have seen this notice. No analytics or advertising cookies are in use, so there are no optional categories to enable right now.</p>';
  dialog.showModal();
});

document.querySelector('#year').textContent = new Date().getFullYear();
const now = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
const hour = Number(now.find((part) => part.type === 'hour').value);
const minute = Number(now.find((part) => part.type === 'minute').value);
const weekday = now.find((part) => part.type === 'weekday').value;
const isOpen = ![''].includes(weekday) && (hour > 10 || (hour === 10 && minute >= 0)) && hour < 20;
document.querySelector('#open-status-text').textContent = isOpen ? 'Open now · until 8 pm' : 'Open daily · 10 am–8 pm';
document.querySelector('#hours-status').textContent = isOpen ? 'Open now' : 'Open daily';
