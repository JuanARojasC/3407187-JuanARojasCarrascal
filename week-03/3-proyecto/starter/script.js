// ===============================
// SISTEMA PRINCIPAL
// ===============================

class GlobalTextSystem {
  #items = [];
  #users = [];
  #transactions = [];

  // ===== SERVICIOS =====
  addItem(item) {
    this.#items.push(item);
  }

  getAllItems() {
    return [...this.#items];
  }

  // ===== USUARIOS =====
  addUser(user) {
    this.#users.push(user);
  }

  getAllUsers() {
    return [...this.#users];
  }

  // ===== PROYECTOS / HISTORIAL =====
  addTransaction(service, user, status = "En proceso") {
    const transaction = {
      id: crypto.randomUUID(),
      service: service.name,
      assignedTo: user.name,
      date: new Date().toLocaleDateString(),
      status
    };

    this.#transactions.push(transaction);
    return transaction;
  }

  getAllTransactions() {
    return [...this.#transactions];
  }

  // ===== ESTADÍSTICAS =====
  getStats() {
    const total = this.#items.length;
    const active = this.#items.filter(i => i.active !== false).length;
    const inactive = total - active;
    const users = this.#users.length;

    return { total, active, inactive, users };
  }
}

// ===============================
// CLASES DE SERVICIOS
// ===============================

class BaseService {
  constructor(name, location) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.location = location;
    this.active = true;
  }
}

class TranslationService extends BaseService {
  constructor(name, location, sourceLang, targetLang, field) {
    super(name, location);
    this.sourceLang = sourceLang;
    this.targetLang = targetLang;
    this.field = field;
  }
}

class LocalizationService extends BaseService {
  constructor(name, location, platform, language) {
    super(name, location);
    this.platform = platform;
    this.language = language;
  }
}

class RevisionService extends BaseService {
  constructor(name, location, specialty, language, certified) {
    super(name, location);
    this.specialty = specialty;
    this.language = language;
    this.certified = certified;
  }
}

// ===============================
// CLASES DE USUARIOS
// ===============================

class BaseUser {
  constructor(name, email, role) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.role = role;
  }

  getInfo() {
    return {
      name: this.name,
      email: this.email,
      role: this.role
    };
  }
}

class ProjectManager extends BaseUser {
  constructor(name, email, department, projects, level) {
    super(name, email, "ProjectManager");
    this.department = department;
    this.projects = projects;
    this.level = level;
  }
}

class Translator extends BaseUser {
  constructor(name, email, languages, specialty, availability) {
    super(name, email, "Translator");
    this.languages = languages;
    this.specialty = specialty;
    this.availability = availability;
  }
}

class Reviewer extends BaseUser {
  constructor(name, email, specialty, experience) {
    super(name, email, "Reviewer");
    this.specialty = specialty;
    this.experience = experience;
  }
}

// ===============================
// INSTANCIA DEL SISTEMA
// ===============================

const system = new GlobalTextSystem();

// ===============================
// DATOS DE EJEMPLO (2 servicios y 2 usuarios)
// Se cargan automáticamente al iniciar
// ===============================

// Servicios de ejemplo
const service1 = new TranslationService(
  "Traducción Legal Internacional",
  "España",
  "ES",
  "EN",
  "Legal"
);

const service2 = new RevisionService(
  "Revisión Técnica IT",
  "Alemania",
  "Tecnología",
  "DE",
  true
);

// Usuarios de ejemplo
const user1 = new ProjectManager(
  "Laura Gómez",
  "laura@gtext.com",
  "Operaciones",
  [],
  "Senior"
);

const user2 = new Translator(
  "Carlos Ruiz",
  "carlos@gtext.com",
  ["ES-EN"],
  "Legal",
  "Disponible"
);

// Registro en el sistema
system.addItem(service1);
system.addItem(service2);

system.addUser(user1);
system.addUser(user2);

// Proyectos de ejemplo en historial
system.addTransaction(service1, user1, "En proceso");
system.addTransaction(service2, user2, "Finalizado");

// ===============================
// RENDER SERVICIOS
// ===============================

const renderItems = (items = []) => {
  const container = document.getElementById('item-list');
  container.innerHTML = '';

  items.forEach(item => {
    container.innerHTML += `
      <div class="item-card">
        <h3>${item.name}</h3>
        <p>Ubicación: ${item.location}</p>
        <p>Estado: ${item.active ? "Activo" : "Inactivo"}</p>
      </div>
    `;
  });
};

// ===============================
// RENDER USUARIOS
// ===============================

const renderUsers = (users = []) => {
  const container = document.getElementById('user-list');
  container.innerHTML = '';

  if (users.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <div class="empty-state-text">No hay miembros registrados</div>
      </div>
    `;
    return;
  }

  container.className = "members-grid";

  users.forEach(user => {
    const info = user.getInfo();
    const initials = info.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();

    container.innerHTML += `
      <div class="member-card">
        <div class="member-avatar">${initials}</div>
        <div class="member-name">${info.name}</div>
        <div class="member-email">${info.email}</div>

        <div class="member-stats">
          <div class="member-stat">
            <div class="member-stat-value">${info.role}</div>
            <div class="member-stat-label">Rol</div>
          </div>
        </div>

        <span class="membership-badge standard">
          ${info.role}
        </span>
      </div>
    `;
  });
};

// ===============================
// RENDER PROYECTOS
// ===============================

const renderTransactions = (transactions = []) => {
  const container = document.getElementById('transaction-list');
  container.innerHTML = '';

  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📁</div>
        <div class="empty-state-text">No hay proyectos registrados</div>
      </div>
    `;
    return;
  }

  container.className = "items-grid";

  transactions.forEach(t => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-title">${t.service}</div>
        <div class="item-details">
          <p><strong>Responsable:</strong> ${t.assignedTo}</p>
          <p><strong>Fecha:</strong> ${t.date}</p>
          <p><strong>Estado:</strong> ${t.status}</p>
        </div>
      </div>
    `;
  });
};
// ===============================
// RENDER ESTADÍSTICAS
// ===============================

const renderStats = stats => {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;
  document.getElementById('stat-users').textContent = stats.users;
};

// ===============================
// INICIALIZACIÓN
// ===============================

const init = () => {

  renderItems(system.getAllItems());
  renderUsers(system.getAllUsers());
  renderTransactions(system.getAllTransactions());
  renderStats(system.getStats());

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
    });
  });

  // ===== MODAL SERVICIOS =====
  document.getElementById('add-item-btn').addEventListener('click', () => {
    document.getElementById('item-modal').style.display = 'block';
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('item-modal').style.display = 'none';
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('item-modal').style.display = 'none';
  });

  document.getElementById('item-form').addEventListener('submit', e => {
    e.preventDefault();

    const type = document.getElementById('item-type').value;
    const name = document.getElementById('item-name').value;
    const location = document.getElementById('item-location').value;

    let service;

    if (type === "TranslationService") {
      service = new TranslationService(name, location, "ES", "EN", "General");
    }

    if (type === "LocalizationService") {
      service = new LocalizationService(name, location, "Web", "ES");
    }

    if (type === "RevisionService") {
      service = new RevisionService(name, location, "General", "ES", true);
    }

    if (service) {
      system.addItem(service);
      renderItems(system.getAllItems());
      renderStats(system.getStats());
    }

    e.target.reset();
    document.getElementById('item-modal').style.display = 'none';
  });

  // ===== MODAL USUARIOS =====
  document.getElementById('add-user-btn').addEventListener('click', () => {
    document.getElementById('user-modal').style.display = 'block';
  });

  document.getElementById('close-user-modal').addEventListener('click', () => {
    document.getElementById('user-modal').style.display = 'none';
  });

  document.getElementById('cancel-user-btn').addEventListener('click', () => {
    document.getElementById('user-modal').style.display = 'none';
  });

  document.getElementById('user-form').addEventListener('submit', e => {
    e.preventDefault();

    const role = document.getElementById('user-role').value;
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;

    let user;

    if (role === "ProjectManager") {
      user = new ProjectManager(name, email, "General", [], "Mid");
    }

    if (role === "Translator") {
      user = new Translator(name, email, ["ES-EN"], "General", "Disponible");
    }

    if (role === "Reviewer") {
      user = new Reviewer(name, email, "General", 3);
    }

    if (user) {
      system.addUser(user);
      renderUsers(system.getAllUsers());
      renderStats(system.getStats());
    }

    e.target.reset();
    document.getElementById('user-modal').style.display = 'none';
  });

};

document.addEventListener('DOMContentLoaded', init);