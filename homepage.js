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

function renderHomepage() {
  calendarRoot.innerHTML = `
    <main class="admin-calendar-screen" aria-label="Admin calendar screen">
      <button class="menu-button" type="button" aria-label="Open settings">☰</button>
      <header class="date-header">
        <strong>17</strong>
        <span>MARCH</span>
      </header>
      ${tasksOpen ? buildOpenTaskPanel() : buildClosedTaskBar()}
      <section class="calendar-scroll" aria-label="Scrollable calendar months">
        ${buildCalendar()}
      </section>
      <button class="add-task" type="button" aria-label="Create new task">+</button>
    </main>
  `;

  calendarRoot.querySelector('.task-dropdown').addEventListener('click', () => {
    tasksOpen = !tasksOpen;
    renderHomepage();
  });
}

renderHomepage();
