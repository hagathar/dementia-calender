const calendarRoot = document.getElementById('homepage') || document.body;

const monthNames = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const tasks = [
  { title: 'first task', items: ['first list item', 'first list item'] },
];

let tasksOpen = false;
let sidePanel = null;
let grandpaCalendarOpen = false;

function buildCalendarMonth(year, monthIndex) {
  const firstDate = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const mondayFirstOffset = (firstDate.getDay() + 6) % 7;
  const cells = [];

  for (let index = 0; index < mondayFirstOffset; index += 1) {
    cells.push('<span class="calendar-day calendar-day--empty"></span>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`<button class="calendar-day" type="button">${day}</button>`);
  }

  return `
    <section class="calendar-month" aria-label="${monthNames[monthIndex]} ${year}">
      <h2>${monthNames[monthIndex]}</h2>
      <div class="calendar-weekdays" aria-hidden="true">
        ${dayLabels.map((label) => `<span>${label}</span>`).join('')}
      </div>
      <div class="calendar-grid">
        ${cells.join('')}
      </div>
    </section>
  `;
}

function buildCalendar() {
  const year = 2026;
  return monthNames.map((_, monthIndex) => buildCalendarMonth(year, monthIndex)).join('');
}

function buildClosedTaskBar() {
  return `
    <button class="task-dropdown" type="button" aria-expanded="false">
      <span>TASKS ASSIGNED FOR TODAY</span>
      <span class="task-dropdown__arrow" aria-hidden="true">⌄</span>
    </button>
  `;
}

function buildOpenTaskPanel() {
  return `
    <section class="task-panel" aria-label="Tasks assigned for today">
      <button class="task-dropdown task-dropdown--open" type="button" aria-expanded="true">
        <span>TASKS ASSIGNED FOR TODAY</span>
        <span class="task-dropdown__arrow" aria-hidden="true">⌃</span>
      </button>
      ${tasks
        .map(
          (task) => `
            <article class="task-card">
              <button class="task-card__title" type="button">
                <span>${task.title}</span>
                <span aria-hidden="true">⌄</span>
              </button>
              <ul>
                ${task.items
                  .map(
                    (item) => `
                      <li>
                        <span>${item}</span>
                        <button class="task-check" type="button" aria-label="Mark ${item} complete"></button>
                      </li>
                    `,
                  )
                  .join('')}
              </ul>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

function buildMainCalendarScreen() {
  return `
    <button class="menu-button" type="button" aria-label="Open menu">☰</button>
    <header class="date-header">
      <strong>17</strong>
      <span>MARCH</span>
    </header>
    ${tasksOpen ? buildOpenTaskPanel() : buildClosedTaskBar()}
    <section class="calendar-scroll" aria-label="Scrollable calendar months">
      ${buildCalendar()}
    </section>
    <button class="add-task" type="button" aria-label="Create new task">+</button>
  `;
}

function buildGrandpaCalendarPanel() {
  if (!grandpaCalendarOpen) {
    return '';
  }

  return `
    <section class="account-calendar" aria-label="Grandpa calendar details">
      <h2>Calendars</h2>
      <div class="calendar-row">
        <strong>Medication</strong>
        <button class="calendar-remove" type="button">remove</button>
        <button class="calendar-show" type="button">show</button>
      </div>
      <h2>recently completed tasks</h2>
      <div class="recent-task">
        <span>completed</span>
        <span class="recent-task__check" aria-hidden="true">✓</span>
      </div>
    </section>
  `;
}

function buildMenuPanel() {
  return `
    <section class="side-panel side-panel--menu" aria-label="Menu">
      <button class="settings-cog" type="button" aria-label="Open settings">⚙</button>
      <nav class="menu-links" aria-label="Admin menu links">
        <button type="button">All tasks</button>
        <button type="button">All lists</button>
        <button type="button">Calendars</button>
      </nav>
      <h2>Users</h2>
      <button class="account-select" type="button" aria-expanded="${grandpaCalendarOpen}">
        <span class="account-avatar" aria-hidden="true">●</span>
        <span>Grandpa</span>
        <span aria-hidden="true">⌄</span>
      </button>
      ${buildGrandpaCalendarPanel()}
      <h2>Admins</h2>
      <div class="admin-account">
        <span class="account-avatar" aria-hidden="true">●</span>
        <span>Admin 1</span>
      </div>
    </section>
  `;
}

function buildSettingsPanel() {
  return `
    <section class="side-panel side-panel--settings" aria-label="Settings">
      <button class="menu-button menu-button--inside" type="button" aria-label="Return to menu">☰</button>
      <label class="setting-row">
        <span>Text size</span>
        <input type="range" min="0" max="100" value="50" aria-label="Text size" />
        <output>50</output>
      </label>
      <fieldset class="theme-picker">
        <legend>Theme</legend>
        <button class="theme-dot theme-dot--white" type="button" aria-label="White theme"></button>
        <button class="theme-dot theme-dot--blue" type="button" aria-label="Blue theme"></button>
        <button class="theme-dot theme-dot--orange" type="button" aria-label="Orange theme"></button>
      </fieldset>
      <button class="create-account" type="button">create new account</button>
      <button class="search-accounts" type="button">Search accounts</button>
    </section>
  `;
}

function buildSidePanelOverlay() {
  if (!sidePanel) {
    return '';
  }

  return `
    <div class="menu-overlay" aria-label="Open menu overlay">
      ${sidePanel === 'settings' ? buildSettingsPanel() : buildMenuPanel()}
      <button class="menu-backdrop" type="button" aria-label="Close menu and return to calendar"></button>
    </div>
  `;
}

function closeToOpenCalendar() {
  sidePanel = null;
  grandpaCalendarOpen = false;
  tasksOpen = true;
}

function bindHomepageEvents() {
  const taskDropdown = calendarRoot.querySelector('.task-dropdown');
  if (taskDropdown) {
    taskDropdown.addEventListener('click', () => {
      tasksOpen = !tasksOpen;
      renderHomepage();
    });
  }

  calendarRoot.querySelectorAll('.menu-button').forEach((button) => {
    button.addEventListener('click', () => {
      sidePanel = sidePanel === 'settings' ? 'menu' : 'menu';
      renderHomepage();
    });
  });

  const settingsCog = calendarRoot.querySelector('.settings-cog');
  if (settingsCog) {
    settingsCog.addEventListener('click', () => {
      sidePanel = 'settings';
      renderHomepage();
    });
  }

  const accountSelect = calendarRoot.querySelector('.account-select');
  if (accountSelect) {
    accountSelect.addEventListener('click', () => {
      grandpaCalendarOpen = !grandpaCalendarOpen;
      renderHomepage();
    });
  }

  const backdrop = calendarRoot.querySelector('.menu-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeToOpenCalendar();
      renderHomepage();
    });
  }
}

function renderHomepage() {
  calendarRoot.innerHTML = `
    <main class="admin-calendar-screen" aria-label="Admin calendar screen">
      ${buildMainCalendarScreen()}
      ${buildSidePanelOverlay()}
    </main>
  `;

  bindHomepageEvents();
}

renderHomepage();
