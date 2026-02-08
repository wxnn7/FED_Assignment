
// User dropdown
const userDD = document.querySelector('.user-dropdown');
const userToggle = document.querySelector('.user-toggle');

userToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  userDD.classList.toggle('open');
});

document.addEventListener('click', () => {
  userDD?.classList.remove('open');
});


// Language dropdown
const langDD = document.getElementById('langDropdown');
const langToggle = document.getElementById('langToggle');
const langMenu = document.getElementById('langMenu');
const langFlag = document.getElementById('langFlag');
const langValue = document.getElementById('langValue');

function closeLang() {
  langDD?.classList.remove('open');
  langToggle?.setAttribute('aria-expanded', 'false');
}

langToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langDD.classList.toggle('open');
  langToggle.setAttribute('aria-expanded', String(isOpen));
});

langMenu?.addEventListener('click', (e) => {
  const option = e.target.closest('.lang-option');
  if (!option) return;

  const newLang = option.dataset.lang;
  const newFlag = option.dataset.flag;

  langValue.textContent = newLang;
  langFlag.src = newFlag;
  langFlag.alt = newLang;

  // this to save preference
  localStorage.setItem('selectedLanguage', newLang);
  localStorage.setItem('selectedFlag', newFlag);

  closeLang();
});

document.addEventListener('click', closeLang);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLang();
});

// load saved language
const savedLang = localStorage.getItem('selectedLanguage');
const savedFlag = localStorage.getItem('selectedFlag');

if (savedLang && savedFlag) {
  langValue.textContent = savedLang;
  langFlag.src = savedFlag;
  langFlag.alt = savedLang;
}
