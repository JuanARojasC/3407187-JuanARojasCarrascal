
// Estado global
let items = [];
let editingItemId = null;

// Categorías del dominio
const CATEGORIES = {
  translation: { name: 'Traducción', emoji: '🌍' },
  localization: { name: 'Localización', emoji: '🗺️' },
  revision: { name: 'Revisión', emoji: '📝' },
};

// Prioridades
const PRIORITIES = {
  high: { name: 'Alta', color: '#ef4444' },
  medium: { name: 'Media', color: '#f59e0b' },
  low: { name: 'Baja', color: '#22c55e' }
};

// Cargar items desde localStorage
const loadItems = () =>
  JSON.parse(localStorage.getItem('translationServices') ?? '[]');

// Guardar items en localStorage
const saveItems = itemsToSave =>
  localStorage.setItem('translationServices', JSON.stringify(itemsToSave));

// Crear nuevo servicio
const createItem = (itemData = {}) => {
  const newItem = {
    id: Date.now(),
    name: itemData.name ?? '',
    description: itemData.description ?? '',
    category: itemData.category ?? 'translation',
    priority: itemData.priority ?? 'medium',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    country: itemData.country ?? '',
    industry: itemData.industry ?? '',
    ...itemData
  };

  const newItems = [...items, newItem];
  saveItems(newItems);
  return newItems;
};

// Actualizar servicio existente
const updateItem = (id, updates) => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

// Eliminar servicio por ID
const deleteItem = id => {
  const filteredItems = items.filter(item => item.id !== id);
  saveItems(filteredItems);
  return filteredItems;
};

// Alternar estado activo/inactivo
const toggleItemActive = id => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, active: !item.active, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

// Eliminar todos los inactivos
const clearInactive = () => {
  const activeItems = items.filter(item => item.active);
  saveItems(activeItems);
  return activeItems;
};

// Filtrar por estado
const filterByStatus = (itemsToFilter, status = 'all') => {
  if (status === 'all') return itemsToFilter;
  if (status === 'active') return itemsToFilter.filter(i => i.active);
  if (status === 'inactive') return itemsToFilter.filter(i => !i.active);
  return itemsToFilter;
};

// Filtrar por categoría
const filterByCategory = (itemsToFilter, category = 'all') =>
  category === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.category === category);

// Filtrar por prioridad
const filterByPriority = (itemsToFilter, priority = 'all') =>
  priority === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.priority === priority);

// Buscar por nombre o descripción
const searchItems = (itemsToFilter, query = '') => {
  if (!query.trim()) return itemsToFilter;
  const term = query.toLowerCase();
  return itemsToFilter.filter(item =>
    item.name.toLowerCase().includes(term) ||
    (item.description ?? '').toLowerCase().includes(term)
  );
};

// Aplicar todos los filtros
const applyFilters = (itemsToFilter, filters = {}) => {
  const {
    status = 'all',
    category = 'all',
    priority = 'all',
    search = ''
  } = filters;

  let result = filterByStatus(itemsToFilter, status);
  result = filterByCategory(result, category);
  result = filterByPriority(result, priority);
  result = searchItems(result, search);
  return result;
};

// Calcular estadísticas
const getStats = (itemsToAnalyze = []) => {
  const total = itemsToAnalyze.length;
  const active = itemsToAnalyze.filter(i => i.active).length;
  const inactive = total - active;

  const byCategory = itemsToAnalyze.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  const byPriority = itemsToAnalyze.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] ?? 0) + 1;
    return acc;
  }, {});

  return { total, active, inactive, byCategory, byPriority };
};

// Obtener emoji de categoría
const getCategoryEmoji = category =>
  CATEGORIES[category]?.emoji ?? '📌';

// Formatear fecha
const formatDate = dateString =>
  new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

// Renderizar un servicio
const renderItem = item => {
  const { id, name, description, category, priority, active, createdAt } = item;

  return `
    <div class="item ${active ? '' : 'inactive'} priority-${priority}" data-item-id="${id}">
      <input type="checkbox" class="item-checkbox" ${active ? 'checked' : ''}>
      <div class="item-content">
        <h3>${name}</h3>
        ${description ? `<p>${description}</p>` : ''}
        <div class="item-meta">
          <span>${getCategoryEmoji(category)} ${CATEGORIES[category]?.name ?? category}</span>
          <span>${PRIORITIES[priority]?.name ?? priority}</span>
          <span>📅 ${formatDate(createdAt)}</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-edit">✏️</button>
        <button class="btn-delete">🗑️</button>
      </div>
    </div>
  `;
};

// Renderizar lista completa
const renderItems = itemsToRender => {
  const itemList = document.getElementById('item-list');
  const emptyState = document.getElementById('empty-state');

  if (itemsToRender.length === 0) {
    itemList.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    itemList.innerHTML = itemsToRender.map(renderItem).join('');
  }
};

// Renderizar estadísticas
const renderStats = stats => {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;
};

// Manejar envío del formulario
const handleFormSubmit = e => {
  e.preventDefault();

  const name = document.getElementById('item-name').value.trim();
  const description = document.getElementById('item-description').value.trim();
  const category = document.getElementById('item-category').value;
  const priority = document.getElementById('item-priority').value;
  const country = document.getElementById('country')?.value ?? '';
  const industry = document.getElementById('industry')?.value ?? '';

  if (!name) return;

  const itemData = { name, description, category, priority, country, industry };

  items = editingItemId
    ? updateItem(editingItemId, itemData)
    : createItem(itemData);

  resetForm();
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

// Toggle desde checkbox
const handleItemToggle = itemId => {
  items = toggleItemActive(itemId);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

// Editar servicio
const handleItemEdit = itemId => {
  const itemToEdit = items.find(i => i.id === itemId);
  if (!itemToEdit) return;

  document.getElementById('item-name').value = itemToEdit.name;
  document.getElementById('item-description').value = itemToEdit.description ?? '';
  document.getElementById('item-category').value = itemToEdit.category;
  document.getElementById('item-priority').value = itemToEdit.priority;

  editingItemId = itemId;
};

// Eliminar servicio
const handleItemDelete = itemId => {
  if (!confirm('¿Eliminar elemento?')) return;
  items = deleteItem(itemId);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

// Obtener filtros actuales
const getCurrentFilters = () => ({
  status: document.getElementById('filter-status').value,
  category: document.getElementById('filter-category').value,
  priority: document.getElementById('filter-priority').value,
  search: document.getElementById('search-input').value
});

// Aplicar filtros actuales
const applyCurrentFilters = () =>
  applyFilters(items, getCurrentFilters());

// Manejar cambio de filtros
const handleFilterChange = () =>
  renderItems(applyCurrentFilters());

// Resetear formulario
const resetForm = () => {
  document.getElementById('item-form').reset();
  editingItemId = null;
};

// Adjuntar listeners
const attachEventListeners = () => {
  document.getElementById('item-form')
    .addEventListener('submit', handleFormSubmit);

  document.getElementById('filter-status')
    .addEventListener('change', handleFilterChange);
  document.getElementById('filter-category')
    .addEventListener('change', handleFilterChange);
  document.getElementById('filter-priority')
    .addEventListener('change', handleFilterChange);
  document.getElementById('search-input')
    .addEventListener('input', handleFilterChange);

  document.getElementById('item-list')
    .addEventListener('click', e => {
      const itemElement = e.target.closest('.item');
      if (!itemElement) return;

      const itemId = parseInt(itemElement.dataset.itemId);

      if (e.target.classList.contains('item-checkbox')) {
        handleItemToggle(itemId);
      } else if (e.target.classList.contains('btn-edit')) {
        handleItemEdit(itemId);
      } else if (e.target.classList.contains('btn-delete')) {
        handleItemDelete(itemId);
      }
    });
};
const renderDetailedStats = stats => {
  const container = document.getElementById('stats-details');
  container.innerHTML = `
    <div class="stat-card"><h4>Total</h4><p>${stats.total}</p></div>
    <div class="stat-card"><h4>Activos</h4><p>${stats.active}</p></div>
    <div class="stat-card"><h4>Inactivos</h4><p>${stats.inactive}</p></div>
  `;
};

// Inicializar aplicación
const init = () => {
  items = loadItems();
  renderItems(items);

  const stats = getStats(items);
  renderStats(stats);
  renderDetailedStats(stats);

  attachEventListeners();
};

document.addEventListener('DOMContentLoaded', init);