//WEEK 01
const entityData = {
  nameEmpress: 'GlobalText',
  description: 'Professional document and media translation',
  identifier: '101',
  title:'Lenguage Solutions Provider', 

  contact: {
    email: 'contact@texttranslation.com',
    phone: '+46 8 442 24 00',
    location: 'Stockholm, Sweden'
  },

  items: [
    { name: 'General Translation', level: 90, category: 'Documents' },
    { name: 'Technical Translation', level: 85, category: 'Engineering' },
    { name: 'Subtitling', level: 80, category: 'Media' },
    { name: 'Proofreading', level: 88, category: 'Editorial' },
    { name: 'Localization', level: 75, category: 'Software' }
  ],

  links: [
    { platform: 'Website', url: 'https://globaltext.se/en/', icon: '🌐' }
  ],

  stats: {
    totalOrders: 1345,
    activeOrders: 37,
    rating: 4.7,
    topLenguagePair: 'EN-ES'
  }
};


// REFERENCIAS DOM


const entityName = document.getElementById('userName');
const entityDescription = document.getElementById('userBio');
const itemsList = document.getElementById('skillsList');
const statsContainer = document.getElementById('stats');
const themeToggle = document.getElementById('themeToggle');
const copyBtn = document.getElementById('copyEmailBtn');
const toggleItemsBtn = document.getElementById('toggleSkills');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const linksContainer = document.getElementById('socialLinks');
const userTitle = document.getElementById('userTitle');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const userLocation = document.getElementById('userLocation');


// INFORMACIÓN BÁSICA


const renderBasicInfo = () => {
  const {
    nameEmpress,
    description,
    title,
    contact: { email, phone, location }
  } = entityData;

  entityName.textContent = nameEmpress;
  userTitle.textContent = title;
  entityDescription.textContent = description;
  userEmail.textContent = email;
  userPhone.textContent = phone;
  userLocation.textContent = {location};
};

// ITEMS

const renderItems = (showAll = false) => {
  const { items } = entityData;

  const itemsToShow = showAll ? items : items.slice(0, 4);

  const itemsHtml = itemsToShow.map(item => {
    const { name, level } = item;

    return `
      <div class="item">
        <div class="item-name">${name}</div>
        <div class="item-level">
          <span>${level}%</span>
          <div class="level-bar">
            <div class="level-fill" style="width: ${level}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  itemsList.innerHTML = itemsHtml;
};

// ENLACES

const renderLinks = () => {
  const { links } = entityData;

  const linksHtml = links.map(link => {
    const { platform, url, icon } = link;

    return `
      <a href="${url}" target="_blank" class="link-item">
        ${icon} ${platform}
      </a>
    `;
  }).join('');

  linksContainer.innerHTML = linksHtml;
};


// ESTADÍSTICAS

const renderStats = () => {
  const { stats } = entityData;

  const statsArray = [
    { label: 'Total', value: stats.totalOrders },
    { label: 'Activos', value: stats.activeOrders },
    { label: 'Rating', value: stats.rating },
    { label: 'Top', value: stats.topLenguagePair }
  ];

  const statsHtml = statsArray.map(stat => `
    <div class="stat-item">
      <span class="stat-value">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
    </div>
  `).join('');

  statsContainer.innerHTML = statsHtml;
};

// TEMA

const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.dataset.theme = newTheme;
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';

  localStorage.setItem('theme', newTheme);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') ?? 'light';
  document.documentElement.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
};

// COPIAR INFORMACIÓN

const copyInfo = () => {
  const { nameEmpress, description, contact } = entityData;

  const infoText = `
${nameEmpress}
${description}
${contact?.email ?? 'No disponible'}
`.trim();

  navigator.clipboard.writeText(infoText);
  showToast('Información copiada');
};

const showToast = message => {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// MOSTRAR / OCULTAR

let showingAllItems = false;

const handleToggleItems = () => {
  showingAllItems = !showingAllItems;
  renderItems(showingAllItems);
  toggleItemsBtn.textContent = showingAllItems ? 'Mostrar menos' : 'Mostrar más';
};

// LISTENERS

themeToggle.addEventListener('click', toggleTheme);
copyBtn.addEventListener('click', copyInfo);
toggleItemsBtn.addEventListener('click', handleToggleItems);

// INIT

const init = () => {
  loadTheme();
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();
  console.log('✅ Aplicación inicializada correctamente');
};

document.addEventListener('DOMContentLoaded', init);